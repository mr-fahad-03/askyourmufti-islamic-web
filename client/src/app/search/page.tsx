"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, MessageSquare, Video, ArrowRight, Bookmark, Loader2, X } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import { buildQuestionHref, getLocaleFromPathname, withLocale } from "@/lib/i18n";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface SearchResult {
    id: string;
    type: "qa" | "sessions";
    title: string;
    preview: string;
    topic: string;
    date: string;
    href: string;
}

export default function SearchPage() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const locale = getLocaleFromPathname(pathname || "/");
    const [query, setQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const queryFromUrl = searchParams.get("q");
        if (queryFromUrl) {
            setQuery(queryFromUrl);
        }
    }, [searchParams]);

    const fetchResults = useCallback(async () => {
        setLoading(true);
        try {
            const [qaRes, sessionsRes] = await Promise.all([
                fetch(`${API_URL}/qa?lang=${locale}`),
                fetch(`${API_URL}/sessions`),
            ]);

            const [qaData, sessionsData] = await Promise.all([qaRes.json(), sessionsRes.json()]);

            const transformedQA: SearchResult[] = (Array.isArray(qaData) ? qaData : []).map((f) => ({
                id: String(f._id),
                type: "qa",
                title: String(f.question || ""),
                preview: String(f.shortAnswer || f.fullAnswer || "").slice(0, 150),
                topic: String(f.topic || "Q&A"),
                date: f.createdAt ? new Date(f.createdAt).toLocaleDateString() : "",
                href: buildQuestionHref(String(f.slug || ""), locale, String(f.qid || "")),
            }));

            const transformedSessions: SearchResult[] = (Array.isArray(sessionsData) ? sessionsData : []).map((s) => ({
                id: String(s._id),
                type: "sessions",
                title: String(s.title || ""),
                preview: String(s.description || "Lecture recording available."),
                topic: "Session",
                date: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "",
                href: withLocale(`/sessions/${s.sessionNumber || s._id}`, locale),
            }));

            let combined = [...transformedQA, ...transformedSessions];

            if (query) {
                const normalizedQuery = query.toLowerCase();
                combined = combined.filter(
                    (item) =>
                        item.title.toLowerCase().includes(normalizedQuery) ||
                        item.preview.toLowerCase().includes(normalizedQuery)
                );
            }

            if (activeFilter !== "all") {
                combined = combined.filter((item) => item.type === activeFilter);
            }

            setResults(combined);
        } catch (error) {
            console.error("Search Error:", error);
        } finally {
            setLoading(false);
        }
    }, [activeFilter, locale, query]);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            fetchResults();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, fetchResults]);

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />

            <section className="pt-32 pb-24 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 dark:text-white mb-4"
                        >
                            {locale === "ur" ? (
                                <>
                                    <span className="text-primary">???? ???????</span> ??? ???? ????
                                </>
                            ) : (
                                <>
                                    Search Knowledge <span className="text-primary">Archive</span>
                                </>
                            )}
                        </motion.h1>
                        <p className="text-zinc-500 dark:text-zinc-400">
                            {locale === "ur"
                                ? "?????? ???? ? ???? ??? ???? ?????????? ??? ???? ???? ?????"
                                : "Search across thousands of Q&As and Session transcripts instantly."}
                        </p>
                    </div>

                    <div className="mb-12">
                        <div className="relative rounded-3xl border border-accent/25 bg-white shadow-xl shadow-primary/5 transition-all focus-within:border-primary/40 focus-within:ring-4 focus-within:ring-primary/10">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                                <SearchIcon size={20} />
                            </div>
                            <input
                                type="text"
                                placeholder={
                                    locale === "ur"
                                        ? "????? ??? ?? ???? ?????..."
                                        : "Ask anything... e.g. Zakat, Nikah, banking"
                                }
                                className="w-full bg-transparent py-5 pl-18 pr-24 text-base md:text-lg text-zinc-900 placeholder:text-zinc-400 outline-none"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                {loading && (
                                    <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                        <Loader2 size={15} className="animate-spin" />
                                    </span>
                                )}
                                {query && (
                                    <button
                                        onClick={() => setQuery("")}
                                        className="w-8 h-8 rounded-full bg-zinc-100 text-zinc-500 hover:bg-zinc-200 transition-colors flex items-center justify-center"
                                        aria-label="Clear search"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-zinc-500 mt-2 px-2">
                            {locale === "ur" ? "????? ???? ????? ?? ???? ?? ???? ????" : "Search by keyword, topic, or full question"}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
                        {["all", "qa", "sessions", "topics"].map((f) => (
                            <button
                                key={f}
                                onClick={() => setActiveFilter(f)}
                                className={cn(
                                    "px-6 py-2.5 rounded-full text-sm font-bold transition-all uppercase tracking-widest",
                                    activeFilter === f
                                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105"
                                        : "bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:border-primary/30"
                                )}
                            >
                                {locale === "ur"
                                    ? f === "all"
                                        ? "????"
                                        : f === "qa"
                                          ? "??????"
                                          : f === "sessions"
                                            ? "?????"
                                            : "???????"
                                    : f}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <AnimatePresence mode="popLayout">
                            {results.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="group p-8 bg-white dark:bg-zinc-900 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 hover:border-primary/50 hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex gap-6">
                                        <div
                                            className={cn(
                                                "w-12 h-12 rounded-2xl flex flex-shrink-0 items-center justify-center",
                                                item.type === "qa"
                                                    ? "bg-primary/10 text-primary"
                                                    : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                                            )}
                                        >
                                            {item.type === "qa" ? <MessageSquare size={24} /> : <Video size={24} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                                    {item.topic}
                                                </span>
                                                <span className="text-xs text-zinc-400 font-medium">{item.date}</span>
                                            </div>
                                            <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
                                                {item.title}
                                            </h3>
                                            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mb-6">
                                                {item.preview}
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <Link
                                                    href={item.href}
                                                    className="inline-flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white hover:text-primary transition-colors"
                                                >
                                                    {locale === "ur" ? "????? ??????" : "View Result"} <ArrowRight size={16} />
                                                </Link>
                                                <button className="text-zinc-300 hover:text-primary transition-colors">
                                                    <Bookmark size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {!query && (
                            <div className="py-24 text-center">
                                <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6 text-zinc-400">
                                    <SearchIcon size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-zinc-400">
                                    {locale === "ur" ? "??????? ?????? ?? ??? ????? ???? ????" : "Begin typing to explore the archive"}
                                </h3>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
