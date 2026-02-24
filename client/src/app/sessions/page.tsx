"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Play, Calendar, Headphones, Search, Loader2, ArrowUpRight, Video } from "lucide-react";
import { getLocaleFromPathname, withLocale } from "@/lib/i18n";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Session {
    _id: string;
    title: string;
    sessionNumber: string;
    dateRecorded: string;
    description: string;
    videoUrl: string;
}

export default function SessionsPage() {
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname || "/");
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const res = await fetch(`${API_URL}/sessions`);
                const data = await res.json();
                setSessions(data);
            } catch (err) {
                console.error("Failed to fetch sessions", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const filteredSessions = sessions.filter(
        (s) =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.sessionNumber.includes(searchQuery) ||
            (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <main className="min-h-screen bg-ivory text-primary selection:bg-accent/30">
            <Navbar />

            <section className="pt-28 pb-16 md:pt-36 md:pb-20 px-6 md:px-12 bg-sand">
                <div className="max-w-7xl mx-auto">
                    <span className="inline-block px-5 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-accent/20">
                        {locale === "ur" ? "\u0639\u0644\u0645\u06cc \u0644\u0627\u0626\u0628\u0631\u06cc\u0631\u06cc" : "Knowledge Library"}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-4">
                        {locale === "ur" ? "\u062a\u0645\u0627\u0645 " : "All "}<span className="text-accent">{locale === "ur" ? "\u0633\u06cc\u0634\u0646\u0632" : "Sessions"}</span>
                    </h1>
                    <p className="text-foreground/50 max-w-xl text-sm md:text-base">
                        {locale === "ur"
                            ? "\u0645\u0641\u062a\u06cc \u0637\u0627\u0631\u0642 \u0645\u0633\u0639\u0648\u062f \u06a9\u06d2 \u062a\u0645\u0627\u0645 \u0633\u0648\u0627\u0644 \u0648 \u062c\u0648\u0627\u0628 \u0633\u06cc\u0634\u0646\u0632 \u062f\u06cc\u06a9\u06be\u06cc\u06ba\u06d4 \u06c1\u0631 \u0633\u06cc\u0634\u0646 \u0645\u06cc\u06ba \u0627\u06c1\u0645 \u0627\u0633\u0644\u0627\u0645\u06cc \u0645\u0648\u0636\u0648\u0639\u0627\u062a \u0627\u0648\u0631 \u0631\u0648\u0632\u0645\u0631\u06c1 \u0645\u0633\u0627\u0626\u0644 \u0634\u0627\u0645\u0644 \u06c1\u06cc\u06ba\u06d4"
                            : "Browse through all recorded Q&A sessions with Mufti Tariq Masood. Each session covers important Islamic topics and everyday questions."}
                    </p>

                    <div className="mt-8 max-w-lg relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/50" />
                        <input
                            type="text"
                            placeholder={locale === "ur" ? "\u0639\u0646\u0648\u0627\u0646 \u06cc\u0627 \u0633\u06cc\u0634\u0646 \u0646\u0645\u0628\u0631 \u0633\u06d2 \u062a\u0644\u0627\u0634 \u06a9\u0631\u06cc\u06ba..." : "Search by title, session number..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-accent/15 bg-white text-primary text-sm focus:ring-2 focus:ring-accent/30 outline-none shadow-sm placeholder:text-foreground/30"
                        />
                    </div>

                    <p className="mt-4 text-xs text-foreground/30 font-medium">
                        {loading
                            ? (locale === "ur" ? "\u0644\u0648\u0688 \u06c1\u0648 \u0631\u06c1\u0627 \u06c1\u06d2..." : "Loading...")
                            : locale === "ur"
                                ? `${filteredSessions.length} \u0633\u06cc\u0634\u0646 \u0645\u0644\u06d2`
                                : `${filteredSessions.length} session${filteredSessions.length !== 1 ? "s" : ""} found`}
                    </p>
                </div>
            </section>

            <section className="py-12 md:py-16 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 size={32} className="animate-spin text-accent" />
                        </div>
                    ) : filteredSessions.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-3xl border border-accent/10">
                            <Video size={56} className="mx-auto text-accent/15 mb-4" />
                            <h3 className="text-xl font-serif font-bold text-primary/60 mb-2">
                                {sessions.length === 0
                                    ? (locale === "ur" ? "\u0627\u0628\u06be\u06cc \u06a9\u0648\u0626\u06cc \u0633\u06cc\u0634\u0646 \u0645\u0648\u062c\u0648\u062f \u0646\u06c1\u06cc\u06ba" : "No sessions yet")
                                    : (locale === "ur" ? "\u06a9\u0648\u0626\u06cc \u0633\u06cc\u0634\u0646 \u0646\u06c1\u06cc\u06ba \u0645\u0644\u0627" : "No sessions found")}
                            </h3>
                            <p className="text-foreground/35 text-sm">
                                {sessions.length === 0
                                    ? (locale === "ur" ? "\u0633\u06cc\u0634\u0646\u0632 \u0634\u0627\u0645\u0644 \u06c1\u0648\u0646\u06d2 \u06a9\u06d2 \u0628\u0639\u062f \u06cc\u06c1\u0627\u06ba \u0638\u0627\u06c1\u0631 \u06c1\u0648\u06ba \u06af\u06d2\u06d4" : "Sessions will appear here once added.")
                                    : (locale === "ur" ? "\u0645\u062e\u062a\u0644\u0641 \u062a\u0644\u0627\u0634 \u06a9\u0627 \u0644\u0641\u0638 \u0627\u0633\u062a\u0639\u0645\u0627\u0644 \u06a9\u0631\u06cc\u06ba\u06d4" : "Try a different search term.")}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
                            {filteredSessions.map((session) => (
                                <Link
                                    key={session._id}
                                    href={session.videoUrl || withLocale(`/sessions/${session.sessionNumber}`, locale)}
                                    target={session.videoUrl ? "_blank" : undefined}
                                    rel={session.videoUrl ? "noreferrer" : undefined}
                                    className="group relative bg-white rounded-3xl border border-accent/10 overflow-hidden hover:shadow-2xl hover:shadow-accent/8 hover:-translate-y-1 transition-all duration-500"
                                >
                                    <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden">
                                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-accent/5 rounded-full group-hover:bg-accent/10 transition-colors" />
                                    </div>

                                    <div className="px-7 pt-7 pb-0 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-2xl bg-primary-dark flex items-center justify-center shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
                                                <Headphones size={20} className="text-accent" />
                                            </div>
                                            <div>
                                                <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-foreground/30">{locale === "ur" ? "\u0633\u06cc\u0634\u0646" : "Session"}</span>
                                                <p className="text-2xl font-serif font-bold text-primary leading-none">#{session.sessionNumber}</p>
                                            </div>
                                        </div>
                                        <div className="w-9 h-9 rounded-full border-2 border-accent/20 flex items-center justify-center text-accent/40 group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-300">
                                            {session.videoUrl ? <ArrowUpRight size={14} /> : <Play size={14} fill="currentColor" />}
                                        </div>
                                    </div>

                                    <div className="mx-7 my-5 h-[1px] bg-gradient-to-r from-accent/20 via-accent/10 to-transparent" />

                                    <div className="px-7 pb-7">
                                        <h3 className="font-serif font-bold text-primary text-[17px] mb-4 leading-snug group-hover:text-accent transition-colors duration-300 line-clamp-2">
                                            {session.title}
                                        </h3>

                                        {session.dateRecorded && (
                                            <div className="flex items-center gap-5 text-xs text-foreground/35 mb-4 font-medium">
                                                <span className="flex items-center gap-1.5">
                                                    <Calendar size={13} className="text-accent/50" />
                                                    {new Date(session.dateRecorded).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </span>
                                            </div>
                                        )}

                                        {session.description && (
                                            <p className="text-xs text-foreground/40 line-clamp-2 leading-relaxed">
                                                {session.description}
                                            </p>
                                        )}
                                    </div>

                                    <div className="h-1 w-0 bg-gradient-to-r from-accent to-accent-light group-hover:w-full transition-all duration-500" />
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
