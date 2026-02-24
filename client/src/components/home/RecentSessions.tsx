"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Play, ArrowUpRight, Calendar, Headphones, Loader2 } from "lucide-react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLocale } from "@/lib/i18n";
import { t } from "@/lib/messages";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Session {
    _id: string;
    title: string;
    sessionNumber: string;
    dateRecorded: string;
    description: string;
    videoUrl: string;
}

export const RecentSessions = () => {
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname || "/");
    const localize = (path: string) => withLocale(path, locale);
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await fetch(`${API_URL}/sessions`);
                const data = await res.json();
                setSessions(data.slice(0, 6));
            } catch (err) {
                console.error("Failed to fetch sessions", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    return (
        <section className="py-16 md:py-24 px-6 md:px-12 bg-sand">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <span className="inline-block px-5 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-accent/20">
                            {t(locale, "sessions.badge")}
                        </span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
                            {t(locale, "sessions.title.start")} <span className="text-accent">{t(locale, "sessions.title.end")}</span>
                        </h2>
                        <p className="text-foreground/50 mt-3 max-w-lg text-sm">
                            {t(locale, "sessions.subtitle")}
                        </p>
                    </div>
                    <Link
                        href={localize("/sessions")}
                        className="group flex items-center gap-2 text-accent font-bold text-sm hover:gap-3 transition-all shrink-0"
                    >
                        {t(locale, "sessions.view_all")}
                        <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 size={28} className="animate-spin text-accent" />
                    </div>
                ) : sessions.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-accent/10">
                            <Headphones size={48} className="mx-auto text-accent/20 mb-4" />
                            <p className="text-foreground/40 font-medium">{t(locale, "sessions.empty")}</p>
                        </div>
                ) : (
                    /* Sessions Grid */
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                        {sessions.map((session) => (
                            <Link
                                key={session._id}
                                href={session.videoUrl || localize(`/sessions/${session.sessionNumber}`)}
                                target={session.videoUrl ? "_blank" : undefined}
                                rel={session.videoUrl ? "noreferrer" : undefined}
                                className="group relative bg-white rounded-3xl border border-accent/10 overflow-hidden hover:shadow-2xl hover:shadow-accent/8 hover:-translate-y-1 transition-all duration-500"
                            >
                                {/* Decorative corner accent */}
                                <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                                    <div className="absolute -top-12 -right-12 w-24 h-24 bg-accent/5 rounded-full group-hover:bg-accent/10 transition-colors" />
                                </div>

                                {/* Session Number Badge */}
                                <div className="px-7 pt-7 pb-0 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-2xl bg-primary-dark flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                                            <Headphones size={20} className="text-accent" />
                                        </div>
                                        <div>
                                            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground/30">
                                                {locale === "ur" ? "سیشن" : "Session"}
                                            </span>
                                            <p className="text-2xl font-serif font-bold text-primary leading-none">
                                                #{session.sessionNumber}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-9 h-9 rounded-full border-2 border-accent/20 flex items-center justify-center text-accent/40 group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300">
                                        <Play size={14} fill="currentColor" />
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="mx-7 my-5 h-[1px] bg-gradient-to-r from-accent/20 via-accent/10 to-transparent" />

                                {/* Content */}
                                <div className="px-7 pb-7">
                                    <h3 className="font-serif font-bold text-primary text-[17px] mb-4 leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-2">
                                        {session.title}
                                    </h3>

                                    <div className="flex items-center gap-5 text-xs text-foreground/35 mb-5 font-medium">
                                        {session.dateRecorded && (
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={13} className="text-accent/50" />
                                                {new Date(session.dateRecorded).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        )}
                                    </div>

                                    {session.description && (
                                        <p className="text-xs text-foreground/40 line-clamp-2 leading-relaxed">
                                            {session.description}
                                        </p>
                                    )}
                                </div>

                                {/* Bottom accent line */}
                                <div className="h-1 w-0 bg-gradient-to-r from-accent to-accent-light group-hover:w-full transition-all duration-500" />
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
