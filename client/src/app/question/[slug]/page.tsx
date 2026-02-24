"use client";

import React, { useEffect, useState } from "react";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
    Loader2,
    ChevronRight,
    Clock,
    MapPin,
    User,
    Hash,
    Tag,
    ArrowRight,
    MessageCircle,
    BookOpen,
} from "lucide-react";
import { getLocaleFromPathname, withLocale } from "@/lib/i18n";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface FAQ {
    _id: string;
    qid: string;
    question: string;
    shortAnswer: string;
    fullAnswer: string;
    sessionNumber: string;
    timestamp: string;
    questionerName: string;
    location: string;
    topic: string;
    subtopic: string;
    slug: string;
    keywords: string[];
}

export default function QuestionDetailPage() {
    const params = useParams();
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname || "/");
    const slug = params.slug as string;
    const [faq, setFaq] = useState<FAQ | null>(null);
    const [relatedFaqs, setRelatedFaqs] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_URL}/qa/slug/${slug}?lang=${locale}`);
                if (!res.ok) {
                    setLoading(false);
                    return;
                }
                const data = await res.json();
                setFaq(data);

                // Fetch related questions (same topic)
                if (data.topic) {
                    const relRes = await fetch(`${API_URL}/qa/topic/${encodeURIComponent(data.topic)}?lang=${locale}`);
                    const relData = await relRes.json();
                    setRelatedFaqs(
                        (Array.isArray(relData) ? relData : [])
                            .filter((q: FAQ) => q.slug !== slug)
                            .slice(0, 5)
                    );
                }
            } catch (err) {
                console.error("Failed to fetch question", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug, locale]);

    if (loading) {
        return (
            <main className="min-h-screen bg-ivory text-primary">
                <Navbar />
                <div className="flex items-center justify-center py-48">
                    <Loader2 size={32} className="animate-spin text-accent" />
                </div>
                <Footer />
            </main>
        );
    }

    if (!faq) {
        return (
            <main className="min-h-screen bg-ivory text-primary">
                <Navbar />
                <div className="text-center py-48">
                    <BookOpen size={56} className="mx-auto text-accent/15 mb-4" />
                    <h1 className="text-2xl font-serif font-bold text-primary/60 mb-2">Question not found</h1>
                    <Link href={withLocale("/qa", locale)} className="text-accent font-bold text-sm hover:underline">Browse all Q&A</Link>
                </div>
                <Footer />
            </main>
        );
    }

    // Convert full answer paragraphs
    const answerParagraphs = faq.fullAnswer.split("\n").filter((p) => p.trim());

    return (
        <main className="min-h-screen bg-ivory text-primary selection:bg-accent/30">
            <Navbar />

            {/* Breadcrumb */}
            <section className="pt-28 pb-8 md:pt-36 md:pb-10 px-6 md:px-12 bg-sand">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center gap-2 text-xs text-foreground/40 mb-6 font-medium flex-wrap">
                        <Link href={withLocale("/", locale)} className="hover:text-accent transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <Link href={withLocale("/qa", locale)} className="hover:text-accent transition-colors">Q&A</Link>
                        <ChevronRight size={12} />
                        <Link href={withLocale(`/topics/${faq.topic.toLowerCase().replace(/\s+/g, "-")}`, locale)} className="hover:text-accent transition-colors">{faq.topic}</Link>
                        <ChevronRight size={12} />
                        <span className="text-accent truncate max-w-[200px]">{faq.question}</span>
                    </div>
                </div>
            </section>

            {/* Question Content */}
            <section className="pb-10 px-6 md:px-12 bg-sand">
                <div className="max-w-4xl mx-auto">
                    {/* Topic badge */}
                    <Link
                        href={withLocale(`/topics/${faq.topic.toLowerCase().replace(/\s+/g, "-")}`, locale)}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-bold tracking-wider uppercase mb-5 border border-accent/20 hover:bg-accent/20 transition-colors"
                    >
                        <Tag size={11} /> {faq.topic}
                        {faq.subtopic && <span className="text-accent/60">/ {faq.subtopic}</span>}
                    </Link>

                    {/* Question Title */}
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary leading-snug mb-6">
                        {faq.question}
                    </h1>

                    {/* Meta info */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-foreground/40 font-medium mb-8">
                        <Link
                            href={withLocale(`/sessions/${faq.sessionNumber}`, locale)}
                            className="flex items-center gap-1.5 hover:text-accent transition-colors"
                        >
                            <Hash size={14} className="text-accent/50" />
                            Session {faq.sessionNumber}
                        </Link>
                        {faq.timestamp && (
                            <span className="flex items-center gap-1.5">
                                <Clock size={14} className="text-accent/50" />
                                {faq.timestamp}
                            </span>
                        )}
                        {faq.questionerName && (
                            <span className="flex items-center gap-1.5">
                                <User size={14} className="text-accent/50" />
                                {faq.questionerName}
                            </span>
                        )}
                        {faq.location && (
                            <span className="flex items-center gap-1.5">
                                <MapPin size={14} className="text-accent/50" />
                                {faq.location}
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Answer Section */}
            <section className="pt-2 pb-12 md:pt-4 md:pb-16 px-6 md:px-12">
                <div className="max-w-4xl mx-auto">
                    {/* Short Answer */}
                    {faq.shortAnswer && (
                        <div className="bg-accent/5 border-l-4 border-accent rounded-r-2xl p-6 mb-10">
                            <p className="text-sm font-bold text-accent uppercase tracking-wider mb-2">Short Answer</p>
                            <p className="text-primary font-medium text-base leading-relaxed">
                                {faq.shortAnswer}
                            </p>
                        </div>
                    )}

                    {/* Full Answer */}
                    <div className="mb-12">
                        <h2 className="text-xl font-serif font-bold text-primary mb-6 flex items-center gap-2">
                            <BookOpen size={18} className="text-accent" /> Detailed Answer
                        </h2>
                        <div className="prose prose-lg max-w-none">
                            {answerParagraphs.length > 0 ? (
                                answerParagraphs.map((para, i) => (
                                    <p key={i} className="text-foreground/70 leading-[1.9] mb-4 text-[15px]">
                                        {para}
                                    </p>
                                ))
                            ) : (
                                <p className="text-foreground/60 text-[15px]">Detailed answer will be added soon.</p>
                            )}
                        </div>
                    </div>

                    {/* Keywords */}
                    {faq.keywords && faq.keywords.length > 0 && (
                        <div className="flex flex-wrap items-center gap-2 mb-12 pt-8 border-t border-accent/10">
                            <span className="text-xs font-bold text-foreground/30 uppercase tracking-wider mr-2">Keywords:</span>
                            {faq.keywords.map((kw) => (
                                <span key={kw} className="px-3 py-1 bg-primary-dark/5 text-primary rounded-lg text-xs font-medium">
                                    {kw}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Related Questions */}
                    {relatedFaqs.length > 0 && (
                        <div className="pt-8 border-t border-accent/10">
                            <h2 className="text-xl font-serif font-bold text-primary mb-6">
                                Related Questions on <span className="text-accent">{faq.topic}</span>
                            </h2>
                            <div className="flex flex-col gap-4">
                                {relatedFaqs.map((related) => (
                                    <Link
                                        key={related._id}
                                        href={withLocale(`/question/${related.slug}`, locale)}
                                        className="group flex items-start gap-4 bg-white rounded-2xl border border-accent/10 p-5 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-accent/20 transition-colors">
                                            <MessageCircle size={14} className="text-accent" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-serif font-bold text-primary text-base group-hover:text-accent transition-colors leading-snug">
                                                {related.question}
                                            </h3>
                                            <span className="text-xs text-foreground/30 font-medium mt-1 inline-block">Session #{related.sessionNumber}</span>
                                        </div>
                                        <ArrowRight size={14} className="text-accent/30 group-hover:text-accent group-hover:translate-x-1 transition-all mt-2 flex-shrink-0" />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
