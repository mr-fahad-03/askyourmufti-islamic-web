"use client";

import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Loader2, MessageCircle, ArrowRight, BookOpen, ChevronRight, Headphones, Tag } from "lucide-react";
import { getLocaleFromPathname, withLocale } from "@/lib/i18n";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface FAQ {
    _id: string;
    question: string;
    shortAnswer: string;
    sessionNumber: string;
    slug: string;
    topic: string;
    timestamp: string;
    questionerName: string;
    location: string;
}

interface SessionInfo {
    _id: string;
    title: string;
    sessionNumber: string;
    dateRecorded: string;
    description: string;
    videoUrl: string;
}

export default function SessionDetailPage() {
    const params = useParams();
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname || "/");
    const sessionId = params.id as string;
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [session, setSession] = useState<SessionInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [faqRes, sessRes] = await Promise.all([
                    fetch(`${API_URL}/qa/session/${sessionId}?lang=${locale}`),
                    fetch(`${API_URL}/sessions`),
                ]);
                const faqData = await faqRes.json();
                const sessData = await sessRes.json();

                setFaqs(Array.isArray(faqData) ? faqData : []);
                const match = sessData.find((s: SessionInfo) => s.sessionNumber === sessionId);
                setSession(match || null);
            } catch (err) {
                console.error("Failed to fetch", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [sessionId, locale]);

    const groupedByTopic: Record<string, FAQ[]> = {};
    faqs.forEach((faq) => {
        const key = faq.topic || "General";
        if (!groupedByTopic[key]) groupedByTopic[key] = [];
        groupedByTopic[key].push(faq);
    });

    const sessionTitle = session?.title || `${locale === "ur" ? "\u0633\u06cc\u0634\u0646" : "Session"} ${sessionId}`;

    return (
        <main className="min-h-screen bg-ivory text-primary selection:bg-accent/30">
            <Navbar />

            <section className="pt-28 pb-14 md:pt-36 md:pb-18 px-6 md:px-12 bg-sand">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-2 text-xs text-foreground/40 mb-4 font-medium">
                        <Link href={withLocale("/", locale)} className="hover:text-accent transition-colors">{locale === "ur" ? "\u06c1\u0648\u0645" : "Home"}</Link>
                        <ChevronRight size={12} />
                        <Link href={withLocale("/sessions", locale)} className="hover:text-accent transition-colors">{locale === "ur" ? "\u0633\u06cc\u0634\u0646\u0632" : "Sessions"}</Link>
                        <ChevronRight size={12} />
                        <span className="text-accent">#{sessionId}</span>
                    </div>

                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-14 h-14 rounded-2xl bg-primary-dark flex items-center justify-center shadow-lg shadow-primary/20">
                            <Headphones size={24} className="text-accent" />
                        </div>
                        <div>
                            <span className="text-xs font-bold uppercase tracking-[0.15em] text-foreground/30">{locale === "ur" ? "\u0633\u06cc\u0634\u0646" : "Session"}</span>
                            <p className="text-3xl md:text-4xl font-serif font-bold text-primary leading-none">#{sessionId}</p>
                        </div>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-serif font-bold text-primary mb-3">{sessionTitle}</h1>

                    {session?.description && <p className="text-foreground/50 max-w-2xl text-sm md:text-base mb-3">{session.description}</p>}

                    <div className="flex items-center gap-4 text-xs text-foreground/30 font-medium">
                        {session?.dateRecorded && (
                            <span>
                                {new Date(session.dateRecorded).toLocaleDateString("en-US", {
                                    year: "numeric", month: "short", day: "numeric",
                                })}
                            </span>
                        )}
                        <span>{locale === "ur" ? `${faqs.length} \u0633\u0648\u0627\u0644\u0627\u062a` : `${faqs.length} question${faqs.length !== 1 ? "s" : ""}`}</span>
                        <span>{locale === "ur" ? `${Object.keys(groupedByTopic).length} \u0645\u0648\u0636\u0648\u0639\u0627\u062a` : `${Object.keys(groupedByTopic).length} topic${Object.keys(groupedByTopic).length !== 1 ? "s" : ""}`}</span>
                    </div>

                    {session?.videoUrl && (
                        <a
                            href={session.videoUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-accent text-white rounded-xl text-sm font-bold hover:bg-accent-light transition-colors shadow-md"
                        >
                            ▶ {locale === "ur" ? "\u0645\u06a9\u0645\u0644 \u0633\u06cc\u0634\u0646 \u062f\u06cc\u06a9\u06be\u06cc\u06ba" : "Watch Full Session"}
                        </a>
                    )}
                </div>
            </section>

            <section className="py-12 md:py-16 px-6 md:px-12">
                <div className="max-w-5xl mx-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 size={32} className="animate-spin text-accent" />
                        </div>
                    ) : faqs.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-3xl border border-accent/10">
                            <BookOpen size={56} className="mx-auto text-accent/15 mb-4" />
                            <h3 className="text-xl font-serif font-bold text-primary/60 mb-2">{locale === "ur" ? "\u0627\u0628\u06be\u06cc \u06a9\u0648\u0626\u06cc \u0633\u0648\u0627\u0644 \u0645\u0648\u062c\u0648\u062f \u0646\u06c1\u06cc\u06ba" : "No questions yet"}</h3>
                            <p className="text-foreground/35 text-sm">{locale === "ur" ? "\u0627\u0633 \u0633\u06cc\u0634\u0646 \u06a9\u06d2 \u0633\u0648\u0627\u0644\u0627\u062a \u0634\u0627\u0645\u0644 \u06c1\u0648\u0646\u06d2 \u06a9\u06d2 \u0628\u0639\u062f \u06cc\u06c1\u0627\u06ba \u0638\u0627\u06c1\u0631 \u06c1\u0648\u06ba \u06af\u06d2\u06d4" : "Questions from this session will appear here once added via the admin panel."}</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-10">
                            {Object.entries(groupedByTopic)
                                .sort(([a], [b]) => a.localeCompare(b))
                                .map(([topic, questions]) => (
                                    <div key={topic}>
                                        <div className="flex items-center gap-2 mb-5">
                                            <Tag size={14} className="text-accent" />
                                            <Link
                                                href={withLocale(`/topics/${topic.toLowerCase().replace(/\s+/g, "-")}`, locale)}
                                                className="text-sm font-bold text-accent uppercase tracking-wider hover:underline"
                                            >
                                                {topic}
                                            </Link>
                                            <span className="text-xs text-foreground/25 font-medium ml-1">({questions.length})</span>
                                        </div>

                                        <div className="flex flex-col gap-4">
                                            {questions.map((faq) => (
                                                <Link
                                                    key={faq._id}
                                                    href={withLocale(`/question/${faq.slug}`, locale)}
                                                    className="group bg-white rounded-2xl border border-accent/10 p-6 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-0.5 transition-all duration-300"
                                                >
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-accent/20 transition-colors">
                                                            <MessageCircle size={16} className="text-accent" />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-serif font-bold text-primary text-lg group-hover:text-accent transition-colors mb-2 leading-snug">
                                                                {faq.question}
                                                            </h3>
                                                            {faq.shortAnswer && (
                                                                <p className="text-foreground/40 text-sm line-clamp-2 leading-relaxed mb-3">
                                                                    {faq.shortAnswer}
                                                                </p>
                                                            )}
                                                            <div className="flex items-center gap-4 text-xs text-foreground/30 font-medium">
                                                                {faq.timestamp && <span>⏱ {faq.timestamp}</span>}
                                                                {faq.questionerName && <span>{locale === "ur" ? `\u0633\u0648\u0627\u0644 \u06a9\u0631\u0646\u06d2 \u0648\u0627\u0644\u0627: ${faq.questionerName}` : `Asked by ${faq.questionerName}`}</span>}
                                                                {faq.location && <span>📍 {faq.location}</span>}
                                                            </div>
                                                        </div>
                                                        <ArrowRight size={16} className="text-accent/30 group-hover:text-accent group-hover:translate-x-1 transition-all mt-2 flex-shrink-0" />
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
