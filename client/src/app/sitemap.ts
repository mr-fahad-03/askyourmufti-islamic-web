import type { MetadataRoute } from "next";
import { SUPPORTED_LOCALES } from "@/lib/i18n";

export const revalidate = 3600;

const getSiteUrl = () => {
    const envUrl =
        process.env.NEXT_PUBLIC_SITE_URL ||
        process.env.SITE_URL ||
        (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");
    return (envUrl || "https://askyourmufti-islamic-web.vercel.app").replace(/\/+$/, "");
};

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

const toLocaleUrl = (siteUrl: string, locale: string, path: string) => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${siteUrl}/${locale}${cleanPath === "/" ? "" : cleanPath}`;
};

const fetchJson = async <T>(url: string): Promise<T | null> => {
    try {
        const res = await fetch(url, { next: { revalidate } });
        if (!res.ok) return null;
        return (await res.json()) as T;
    } catch {
        return null;
    }
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const siteUrl = getSiteUrl();
    const now = new Date();

    const staticPaths = ["/", "/about", "/ask", "/contact", "/donate", "/qa", "/search", "/sessions", "/topics"];

    const entries: MetadataRoute.Sitemap = [];

    for (const locale of SUPPORTED_LOCALES) {
        for (const path of staticPaths) {
            entries.push({
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
            entries.push({
                url: `${toLocaleUrl(siteUrl, locale, `/question/${encodeURIComponent(normalizedSlug)}`)}${qidPart}`,
                lastModified: faq.updatedAt || faq.createdAt || now,
                changeFrequency: "weekly",
                priority: 0.8,
            });
        }

        for (const session of sessionList) {
            const id = session.sessionNumber || session._id;
            if (!id) continue;
            entries.push({
                url: toLocaleUrl(siteUrl, locale, `/sessions/${id}`),
                lastModified: session.updatedAt || session.createdAt || now,
                changeFrequency: "weekly",
                priority: 0.7,
            });
        }

        for (const topic of topicList) {
            const slug = topic.slug || String(topic.name || "").toLowerCase().replace(/\s+/g, "-");
            if (!slug) continue;
            entries.push({
                url: toLocaleUrl(siteUrl, locale, `/topics/${encodeURIComponent(slug)}`),
                lastModified: topic.updatedAt || topic.createdAt || now,
                changeFrequency: "weekly",
                priority: 0.7,
            });
        }
    }

    return entries;
}
