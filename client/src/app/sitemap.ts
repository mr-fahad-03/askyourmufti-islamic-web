import type { MetadataRoute } from "next";
import { readdir } from "node:fs/promises";
import path from "node:path";
import { SUPPORTED_LOCALES } from "@/lib/i18n";

export const dynamic = "force-dynamic";

const getSiteUrl = () => {
    const envUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.SITE_URL;
    return (envUrl || "https://askyourmufti.com").replace(/\/+$/, "");
};

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

const toLocaleUrl = (siteUrl: string, locale: string, path: string) => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${siteUrl}/${locale}${cleanPath === "/" ? "" : cleanPath}`;
};

const shouldIgnoreSegment = (segment: string) => {
    if (!segment) return true;
    if (segment.startsWith("_")) return true;
    if (segment.startsWith("@")) return true;
    if (segment === "api" || segment === "islamic-admin") return true;
    if (segment.startsWith("[") && segment.endsWith("]")) return true;
    return false;
};

const isRouteGroup = (segment: string) => segment.startsWith("(") && segment.endsWith(")");

const normalizeRoutePath = (segments: string[]) => {
    const visibleSegments = segments.filter((segment) => !isRouteGroup(segment));
    if (visibleSegments.length === 0) return "/";
    return `/${visibleSegments.join("/")}`;
};

const PAGE_FILE_PATTERN = /^page\.(js|jsx|ts|tsx|mdx)$/;

const collectStaticAppPaths = async (dir: string, segments: string[] = []): Promise<string[]> => {
    const paths = new Set<string>();
    const entries = await readdir(dir, { withFileTypes: true });

    if (entries.some((entry) => entry.isFile() && PAGE_FILE_PATTERN.test(entry.name))) {
        paths.add(normalizeRoutePath(segments));
    }

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (shouldIgnoreSegment(entry.name)) continue;

        const nextSegments = isRouteGroup(entry.name) ? segments : [...segments, entry.name];
        const childPaths = await collectStaticAppPaths(path.join(dir, entry.name), nextSegments);
        childPaths.forEach((childPath) => paths.add(childPath));
    }

    return [...paths];
};

const fetchJson = async <T>(url: string): Promise<T | null> => {
    try {
        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) return null;
        return (await res.json()) as T;
    } catch {
        return null;
    }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = getSiteUrl();
    const now = new Date();
    const appDir = path.join(process.cwd(), "src", "app");
    const staticPaths = await collectStaticAppPaths(appDir);

    const entries: MetadataRoute.Sitemap = [];
    const seen = new Set<string>();
    const pushEntry = (entry: MetadataRoute.Sitemap[number]) => {
        if (seen.has(entry.url)) return;
        seen.add(entry.url);
        entries.push(entry);
    };

    for (const locale of SUPPORTED_LOCALES) {
        for (const path of staticPaths) {
            pushEntry({
                url: toLocaleUrl(siteUrl, locale, path),
                lastModified: now,
                changeFrequency: path === "/" ? "daily" : "weekly",
                priority: path === "/" ? 1 : 0.7,
            });
        }
    }

    type FaqItem = { slug?: string; qid?: string; updatedAt?: string; createdAt?: string };
    type SessionItem = { sessionNumber?: string; _id?: string; updatedAt?: string; createdAt?: string };
    type TopicItem = { slug?: string; name?: string; updatedAt?: string; createdAt?: string };

    const [faqs, sessions, topics] = await Promise.all([
        fetchJson<FaqItem[]>(`${API_URL}/qa?lang=en`),
        fetchJson<SessionItem[]>(`${API_URL}/sessions`),
        fetchJson<TopicItem[]>(`${API_URL}/topics`),
    ]);

    const faqList = Array.isArray(faqs) ? faqs : [];
    const sessionList = Array.isArray(sessions) ? sessions : [];
    const topicList = Array.isArray(topics) ? topics : [];

    for (const locale of SUPPORTED_LOCALES) {
        for (const faq of faqList) {
            const rawSlug = String(faq.slug || "").trim();
            if (!rawSlug) continue;
            const normalizedSlug = rawSlug.split("#")[0].replace(/^\/+|\/+$/g, "");
            if (!normalizedSlug) continue;
            const qidPart = faq.qid ? `?qid=${encodeURIComponent(String(faq.qid))}` : "";
            pushEntry({
                url: `${toLocaleUrl(siteUrl, locale, `/question/${encodeURIComponent(normalizedSlug)}`)}${qidPart}`,
                lastModified: faq.updatedAt || faq.createdAt || now,
                changeFrequency: "weekly",
                priority: 0.8,
            });
        }

        for (const session of sessionList) {
            const id = session.sessionNumber || session._id;
            if (!id) continue;
            pushEntry({
                url: toLocaleUrl(siteUrl, locale, `/sessions/${encodeURIComponent(String(id))}`),
                lastModified: session.updatedAt || session.createdAt || now,
                changeFrequency: "weekly",
                priority: 0.7,
            });
        }

        for (const topic of topicList) {
            const slug = topic.slug || String(topic.name || "").toLowerCase().replace(/\s+/g, "-");
            if (!slug) continue;
            pushEntry({
                url: toLocaleUrl(siteUrl, locale, `/topics/${encodeURIComponent(slug)}`),
                lastModified: topic.updatedAt || topic.createdAt || now,
                changeFrequency: "weekly",
                priority: 0.7,
            });
        }
    }

    return entries;
}
