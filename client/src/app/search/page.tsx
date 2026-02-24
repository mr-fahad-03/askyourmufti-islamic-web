"use client";

import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { motion, AnimatePresence } from "framer-motion";
import { Search as SearchIcon, MessageSquare, Video, ArrowRight, Filter, Bookmark, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLocale } from "@/lib/i18n";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function SearchPage() {
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname || "/");
    const [query, setQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("all");
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const delayDebounceFn = setTimeout(() => {
            fetchResults();
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query, activeFilter, locale]);

    const fetchResults = async () => {
        setLoading(true);
        try {
            // Fetching both Q&A and Sessions for a unified search experience
            const [qaRes, sessionsRes] = await Promise.all([
                fetch(`${API_URL}/qa?lang=${locale}`),
                fetch(`${API_URL}/sessions`)
            ]);

            const [qaData, sessionsData] = await Promise.all([
                qaRes.json(),
                sessionsRes.json()
            ]);

            const transformedQA = qaData.map((f: any) => ({
                id: f._id,
                type: "qa",
                title: f.question,
                preview: f.shortAnswer || f.fullAnswer.substring(0, 150) + "...",
                topic: f.topic,
                date: new Date(f.createdAt).toLocaleDateString(),
                href: withLocale(`/question/${f.slug}`, locale),
            }));

            const transformedSessions = sessionsData.map((s: any) => ({
                id: s._id,
                type: "session",
                title: s.title,
                preview: s.description || "Lecture recording available.",
                topic: "Session",
                date: new Date(s.createdAt).toLocaleDateString(),
                href: withLocale(`/sessions/${s.sessionNumber || s._id}`, locale),
            }));

            let combined = [...transformedQA, ...transformedSessions];

            if (query) {
                combined = combined.filter(item =>
                    item.title.toLowerCase().includes(query.toLowerCase()) ||
                    item.preview.toLowerCase().includes(query.toLowerCase())
                );
            }

            if (activeFilter !== "all") {
                combined = combined.filter(item => item.type === activeFilter);
            }

            setResults(combined);
            setLoading(false);
        } catch (error) {
            console.error("Search Error:", error);
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <Navbar />

            <section className="pt-32 pb-24 px-6">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <motion.h1
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 dark:text-white mb-4"
                        >
                            {locale === "ur"
                                ? (<><span className="text-primary">علمی آرکائیو</span> میں تلاش کریں</>)
                                : (<>Search Knowledge <span className="text-primary">Archive</span></>)}
                        </motion.h1>
                        <p className="text-zinc-500 dark:text-zinc-400">
                            {locale === "ur"
                                ? "ہزاروں سوال و جواب اور سیشن ٹرانسکرپٹس میں فوری تلاش کریں۔"
                                : "Search across thousands of Q&As and Session transcripts instantly."}
                        </p>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-12">
                        <div className="absolute left-6 top-1/2 -translate-y-1/2 text-primary font-bold flex items-center gap-2">
                            <SearchIcon size={24} />
                        </div>
                        <input
                            type="text"
                            placeholder={locale === "ur"
                                ? "کچھ بھی تلاش کریں... مثلاً زکوٰۃ، نکاح کے احکام، جدید بینکاری"
                                : "Ask anything... e.g. Zakat on property, Nikah rules, Modern banking"}
                            className="w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] py-6 pl-16 pr-8 text-xl focus:ring-4 focus:ring-primary/10 shadow-2xl shadow-primary/5 outline-none transition-all dark:text-white"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        {query && (
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full flex items-center gap-1">
                                    <Sparkles size={12} className="text-amber-500" /> {locale === "ur" ? "AI تجاویز" : "AI Suggestions"}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Filter Bar */}
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
                                    ? (f === "all" ? "تمام" : f === "qa" ? "سوالات" : f === "sessions" ? "سیشنز" : "موضوعات")
                                    : f}
                            </button>
                        ))}
                    </div>

                    {/* Results Feed */}
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
                                        <div className={cn(
                                            "w-12 h-12 rounded-2xl flex flex-shrink-0 items-center justify-center",
                                            item.type === "qa" ? "bg-primary/10 text-primary" : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800"
                                        )}>
                                            {item.type === "qa" ? <MessageSquare size={24} /> : <Video size={24} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest">
                                                    {item.topic || item.series}
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
                                                <Link href={item.href} className="inline-flex items-center gap-2 text-sm font-bold text-zinc-900 dark:text-white hover:text-primary transition-colors">
                                                    {locale === "ur" ? "نتیجہ دیکھیں" : "View Result"} <ArrowRight size={16} />
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
                                    {locale === "ur" ? "آرکائیو دیکھنے کے لیے لکھنا شروع کریں" : "Begin typing to explore the archive"}
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
