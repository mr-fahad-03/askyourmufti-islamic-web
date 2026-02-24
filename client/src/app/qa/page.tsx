"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
    Loader2,
    MessageCircle,
    ArrowRight,
    Search,
    BookOpen,
    Tag,
    Hash,
} from "lucide-react";
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

interface TopicGroup {
    _id: string;
    count: number;
}

export default function QAPage() {
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname || "/");
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [topics, setTopics] = useState<TopicGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [faqRes, topicRes] = await Promise.all([
                    fetch(`${API_URL}/qa?lang=${locale}`),
                    fetch(`${API_URL}/qa/topics-list`),
                ]);
                const faqData = await faqRes.json();
                const topicData = await topicRes.json();
                setFaqs(Array.isArray(faqData) ? faqData : []);
                setTopics(Array.isArray(topicData) ? topicData : []);
            } catch (err) {
                console.error("Failed to fetch", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [locale]);

    const filteredFaqs = faqs.filter((q) => {
        const matchesSearch =
            q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.sessionNumber.includes(searchQuery) ||
            (q.shortAnswer && q.shortAnswer.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesTopic = selectedTopic ? q.topic === selectedTopic : true;
        return matchesSearch && matchesTopic;
    });

    return (
        <main className="min-h-screen bg-ivory text-primary selection:bg-accent/30">
            <Navbar />

            {/* Hero */}
            <section className="pt-28 pb-14 md:pt-36 md:pb-18 px-6 md:px-12 bg-sand">
                <div className="max-w-7xl mx-auto">
                    <span className="inline-block px-5 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-accent/20">
                        {locale === "ur" ? "اسلامی سوال و جواب" : "Islamic Q&A"}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-4">
                        {locale === "ur" ? "سوالات اور " : "Questions & "}
                        <span className="text-accent">{locale === "ur" ? "جوابات" : "Answers"}</span>
                    </h1>
                    <p className="text-foreground/50 max-w-xl text-sm md:text-base">
                        {locale === "ur"
                            ? "موضوعات اور سیشنز کے مطابق منظم، مفتی طارق مسعود کے مستند اسلامی سوال و جواب دیکھیں۔"
                            : "Browse through authentic Islamic rulings and answers by Mufti Tariq Masood, organized by topics and sessions."}
                    </p>

                    {/* Search */}
                    <div className="mt-8 max-w-lg relative">
                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-accent/50" />
                        <input
                            type="text"
                            placeholder={locale === "ur" ? "سوال تلاش کریں..." : "Search questions..."}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-5 py-3.5 rounded-2xl border border-accent/15 bg-white text-primary text-sm focus:ring-2 focus:ring-accent/30 outline-none shadow-sm placeholder:text-foreground/30"
                        />
                    </div>

                    <p className="mt-4 text-xs text-foreground/30 font-medium">
                        {loading
                            ? locale === "ur" ? "لوڈ ہو رہا ہے..." : "Loading..."
                            : locale === "ur"
                                ? `${filteredFaqs.length} سوال`
                                : `${filteredFaqs.length} question${filteredFaqs.length !== 1 ? "s" : ""}`}
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-12 md:py-16 px-6 md:px-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* Sidebar: Topics */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <h3 className="text-sm font-bold text-foreground/40 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <Tag size={13} /> {locale === "ur" ? "موضوع کے لحاظ سے فلٹر کریں" : "Filter by Topic"}
                            </h3>
                            <div className="flex flex-col gap-1">
                                <button
                                    onClick={() => setSelectedTopic(null)}
                                    className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                        !selectedTopic
                                            ? "bg-accent/10 text-accent font-bold"
                                            : "text-foreground/50 hover:bg-accent/5 hover:text-accent"
                                    }`}
                                >
                                    {locale === "ur" ? "تمام موضوعات" : "All Topics"} ({faqs.length})
                                </button>
                                {topics.map((t) => (
                                    <button
                                        key={t._id}
                                        onClick={() => setSelectedTopic(t._id)}
                                        className={`text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                            selectedTopic === t._id
                                                ? "bg-accent/10 text-accent font-bold"
                                                : "text-foreground/50 hover:bg-accent/5 hover:text-accent"
                                        }`}
                                    >
                                        {translateTopicLabel(t._id, locale)} ({t.count})
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main: Questions */}
                    <div className="lg:col-span-3">
                        {loading ? (
                            <div className="flex items-center justify-center py-24">
                                <Loader2 size={32} className="animate-spin text-accent" />
                            </div>
                        ) : filteredFaqs.length === 0 ? (
                            <div className="text-center py-24 bg-white rounded-3xl border border-accent/10">
                                <BookOpen size={56} className="mx-auto text-accent/15 mb-4" />
                                <h3 className="text-xl font-serif font-bold text-primary/60 mb-2">
                                    {faqs.length === 0
                                        ? (locale === "ur" ? "ابھی کوئی سوال موجود نہیں" : "No questions yet")
                                        : (locale === "ur" ? "کوئی نتیجہ نہیں ملا" : "No results found")}
                                </h3>
                                <p className="text-foreground/35 text-sm">
                                    {faqs.length === 0
                                        ? (locale === "ur" ? "ایڈمن پینل سے سوالات شامل ہونے کے بعد یہاں نظر آئیں گے۔" : "Questions will appear here once added via admin panel.")
                                        : (locale === "ur" ? "مختلف تلاش یا موضوع فلٹر آزمائیں۔" : "Try a different search or topic filter.")}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {filteredFaqs.map((faq) => (
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
                                                <div className="flex items-center gap-4 text-xs text-foreground/30 font-medium flex-wrap">
                                                    <span className="flex items-center gap-1.5">
                                                        <Hash size={11} className="text-accent/50" />
                                                        {locale === "ur" ? "سیشن" : "Session"} {faq.sessionNumber}
                                                    </span>
                                                    <span className="px-2.5 py-0.5 bg-accent/10 text-accent rounded-md text-[10px] font-bold uppercase">
                                                        {translateTopicLabel(faq.topic, locale)}
                                                    </span>
                                                    {faq.timestamp && <span>⏱ {faq.timestamp}</span>}
                                                </div>
                                            </div>
                                            <ArrowRight size={16} className="text-accent/30 group-hover:text-accent group-hover:translate-x-1 transition-all mt-2 flex-shrink-0" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
