"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Eye, ArrowUpRight, TrendingUp, MessageCircle, Clock, Loader2 } from "lucide-react";
import { getLocaleFromPathname, withLocale, Locale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { translateTopicLabel } from "@/lib/topicLabels";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface TrendingFAQ {
    _id: string;
    question: string;
    viewCount?: number;
    sessionNumber?: string;
    topic?: string;
    createdAt?: string;
    slug: string;
}

function formatViews(views: number): string {
    if (views >= 1000) {
        return `${(views / 1000).toFixed(1).replace(/\.0$/, "")}K`;
    }
    return views.toString();
}

function formatRelativeTime(dateString: string | undefined, locale: Locale): string {
    if (!dateString) return locale === "ur" ? "\u062d\u0627\u0644 \u06c1\u06cc \u0645\u06cc\u06ba" : "recently";

    const date = new Date(dateString);
    const diffMs = Date.now() - date.getTime();
    const mins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (locale === "ur") {
        if (mins < 1) return "\u0627\u0628\u06be\u06cc";
        if (mins < 60) return `${mins} \u0645\u0646\u0679 \u067e\u06c1\u0644\u06d2`;
        if (hours < 24) return `${hours} \u06af\u06be\u0646\u0679\u06d2 \u067e\u06c1\u0644\u06d2`;
        if (days < 7) return `${days} \u062f\u0646 \u067e\u06c1\u0644\u06d2`;
        if (days < 30) return `${Math.floor(days / 7)} \u06c1\u0641\u062a\u06d2 \u067e\u06c1\u0644\u06d2`;
        return `${Math.floor(days / 30)} \u0645\u0627\u06c1 \u067e\u06c1\u0644\u06d2`;
    }

    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
    if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) === 1 ? "" : "s"} ago`;
    return `${Math.floor(days / 30)} month${Math.floor(days / 30) === 1 ? "" : "s"} ago`;
}

export const MostViewedQuestions = () => {
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname || "/");
    const [items, setItems] = useState<TrendingFAQ[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/qa/trending?lang=${locale}&limit=8`);
                const data = await res.json();
                setItems(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch trending questions", err);
                setItems([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTrending();
    }, [locale]);

    return (
        <section className="py-16 md:py-24 px-6 md:px-12 bg-ivory">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <span className="inline-block px-5 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-accent/20">
                            <TrendingUp size={12} className="inline mr-2 -mt-0.5" />
                            {t(locale, "home.trending.badge")}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
                            {t(locale, "home.trending.title.start")} <span className="text-accent">{t(locale, "home.trending.title.end")}</span>
                        </h2>
                        <p className="text-foreground/50 mt-3 max-w-lg text-sm">
                            {t(locale, "home.trending.subtitle")}
                        </p>
                    </div>
                    <Link
                        href={withLocale("/search", locale)}
                        className="group flex items-center gap-2 text-accent font-bold text-sm hover:gap-3 transition-all shrink-0"
                    >
                        {t(locale, "home.trending.cta")}
                        <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16">
                        <Loader2 size={28} className="animate-spin text-accent" />
                    </div>
                ) : items.length === 0 ? (
                    <div className="text-center py-16 text-foreground/40 text-sm bg-white rounded-2xl border border-accent/10">
                        {locale === "ur" ? "\u0627\u0628\u06be\u06cc \u062a\u06a9 \u06a9\u0648\u0626\u06cc \u0679\u0631\u06cc\u0646\u0688\u0646\u06af \u0633\u0648\u0627\u0644 \u0645\u0648\u062c\u0648\u062f \u0646\u06c1\u06cc\u06ba\u06d4" : "No trending questions yet."}
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-2 gap-5">
                        {items.map((item, index) => (
                            <Link
                                key={item._id}
                                href={withLocale(`/question/${item.slug}`, locale)}
                                className="group relative flex gap-5 bg-white rounded-2xl p-6 border border-accent/8 hover:border-accent/25 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-0.5 transition-all duration-300"
                            >
                                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary-dark flex items-center justify-center shadow-md shadow-primary/15 group-hover:scale-105 transition-transform">
                                    <span className="text-accent font-serif font-bold text-lg">{String(index + 1).padStart(2, "0")}</span>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <h3 className="font-serif font-bold text-primary text-[15px] leading-snug mb-3 group-hover:text-accent transition-colors duration-300 line-clamp-2">
                                        {item.question}
                                    </h3>

                                    <div className="flex items-center gap-4 flex-wrap">
                                        <span className="flex items-center gap-1.5 text-xs text-foreground/35 font-medium">
                                            <Eye size={13} className="text-accent/50" />
                                            {formatViews(item.viewCount || 0)} {locale === "ur" ? "\u0648\u06cc\u0648\u0632" : "views"}
                                        </span>
                                        {!!item.sessionNumber && (
                                            <span className="flex items-center gap-1.5 text-xs text-foreground/35 font-medium">
                                                <MessageCircle size={13} className="text-accent/50" />
                                                {locale === "ur" ? "\u0633\u06cc\u0634\u0646" : "Session"} {item.sessionNumber}
                                            </span>
                                        )}
                                        <span className="flex items-center gap-1.5 text-xs text-foreground/35 font-medium">
                                            <Clock size={13} className="text-accent/50" />
                                            {formatRelativeTime(item.createdAt, locale)}
                                        </span>
                                        {!!item.topic && (
                                            <span className="px-2.5 py-1 bg-primary-dark/5 text-primary font-bold text-[10px] rounded-md tracking-wide uppercase group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                                                {translateTopicLabel(item.topic, locale)}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-shrink-0 self-center w-8 h-8 rounded-full border border-accent/15 flex items-center justify-center text-accent/30 group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300">
                                    <ArrowUpRight size={14} />
                                </div>

                                <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-gradient-to-r from-accent to-accent-light group-hover:w-full transition-all duration-500 rounded-b-2xl" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
