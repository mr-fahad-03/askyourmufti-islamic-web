"use client";

import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Loader2, MessageCircle, ArrowRight, BookOpen, Hash, ChevronRight } from "lucide-react";
import { getLocaleFromPathname, withLocale } from "@/lib/i18n";
import { translateTopicLabel } from "@/lib/topicLabels";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface FAQ {
    _id: string;
    question: string;
    shortAnswer: string;
    sessionNumber: string;
    slug: string;
    topic: string;
    timestamp: string;
}

export default function TopicDetailPage() {
    const params = useParams();
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname || "/");
    const slug = params.slug as string;
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);

    const topicName = slug
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");

    const translatedTopicName = translateTopicLabel(topicName, locale);

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                const res = await fetch(`${API_URL}/qa/topic/${encodeURIComponent(topicName)}?lang=${locale}`);
                const data = await res.json();
                setFaqs(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch topic FAQs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchFAQs();
    }, [topicName, locale]);

    const groupedBySession: Record<string, FAQ[]> = {};
    faqs.forEach((faq) => {
        const key = faq.sessionNumber || "Other";
        if (!groupedBySession[key]) groupedBySession[key] = [];
        groupedBySession[key].push(faq);
    });

    return (
        <main className="min-h-screen bg-ivory text-primary selection:bg-accent/30">
            <Navbar />

            <section className="pt-28 pb-14 md:pt-36 md:pb-18 px-6 md:px-12 bg-sand">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-2 text-xs text-foreground/40 mb-4 font-medium">
                        <Link href={withLocale("/", locale)} className="hover:text-accent transition-colors">
                            {locale === "ur" ? "\u06c1\u0648\u0645" : "Home"}
                        </Link>
                        <ChevronRight size={12} />
                        <Link href={withLocale("/topics", locale)} className="hover:text-accent transition-colors">
                            {locale === "ur" ? "\u0645\u0648\u0636\u0648\u0639\u0627\u062a" : "Topics"}
                        </Link>
                        <ChevronRight size={12} />
                        <span className="text-accent">{translatedTopicName}</span>
                    </div>

                    <span className="inline-block px-5 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-accent/20">
                        {locale === "ur" ? "\u0645\u0648\u0636\u0648\u0639" : "Topic"}
                    </span>
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-3">
                        {translatedTopicName} <span className="text-accent">{locale === "ur" ? "\u06a9\u06d2 \u0633\u0648\u0627\u0644\u0627\u062a" : "in Islam"}</span>
                    </h1>
                    <p className="text-foreground/50 max-w-2xl text-sm md:text-base">
                        {locale === "ur"
                            ? `${translatedTopicName} \u06a9\u06d2 \u0645\u062a\u0639\u0644\u0642 \u0645\u0641\u062a\u06cc \u0637\u0627\u0631\u0642 \u0645\u0633\u0639\u0648\u062f \u06a9\u06d2 \u062c\u0648\u0627\u0628\u0627\u062a \u0627\u0648\u0631 \u0631\u06c1\u0646\u0645\u0627\u0626\u06cc \u06cc\u06c1\u0627\u06ba \u0645\u0648\u062c\u0648\u062f \u06c1\u06d2\u06d4`
                            : `Explore all questions and answers related to ${topicName.toLowerCase()} as explained by Mufti Tariq Masood in his Q&A sessions.`}
                    </p>
                    <p className="mt-3 text-xs text-foreground/30 font-medium">
                        {loading
                            ? (locale === "ur" ? "\u0644\u0648\u0688 \u06c1\u0648 \u0631\u06c1\u0627 \u06c1\u06d2..." : "Loading...")
                            : locale === "ur"
                                ? `${faqs.length} \u0633\u0648\u0627\u0644\u0627\u062a`
                                : `${faqs.length} question${faqs.length !== 1 ? "s" : ""} found`}
                    </p>
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
                            <h3 className="text-xl font-serif font-bold text-primary/60 mb-2">
                                {locale === "ur" ? "\u0627\u0633 \u0645\u0648\u0636\u0648\u0639 \u067e\u0631 \u0627\u0628\u06be\u06cc \u0633\u0648\u0627\u0644\u0627\u062a \u0645\u0648\u062c\u0648\u062f \u0646\u06c1\u06cc\u06ba" : "No questions yet"}
                            </h3>
                            <p className="text-foreground/35 text-sm">
                                {locale === "ur"
                                    ? `${translatedTopicName} \u06a9\u06d2 \u0633\u0648\u0627\u0644\u0627\u062a \u0634\u0627\u0645\u0644 \u06c1\u0648\u0646\u06d2 \u06a9\u06d2 \u0628\u0639\u062f \u06cc\u06c1\u0627\u06ba \u062f\u06a9\u06be\u0627\u0626\u06cc \u062f\u06cc\u06ba \u06af\u06d2\u06d4`
                                    : `Questions about ${topicName} will appear here once added.`}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-10">
                            {Object.entries(groupedBySession)
                                .sort(([a], [b]) => Number(b) - Number(a))
                                .map(([sessionNum, questions]) => (
                                    <div key={sessionNum}>
                                        <Link
                                            href={withLocale(`/sessions/${sessionNum}`, locale)}
                                            className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-dark/5 text-primary rounded-full text-xs font-bold tracking-wider uppercase mb-5 hover:bg-primary-dark/10 transition-colors"
                                        >
                                            <Hash size={12} /> {locale === "ur" ? "\u0633\u06cc\u0634\u0646" : "Session"} {sessionNum}
                                        </Link>

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
                                                                <span>{locale === "ur" ? "\u0633\u06cc\u0634\u0646" : "Session"} #{faq.sessionNumber}</span>
                                                                {faq.timestamp && <span>{faq.timestamp}</span>}
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
