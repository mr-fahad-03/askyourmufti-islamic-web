"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Loader2, BookOpen, ArrowRight, Tag } from "lucide-react";
import { getLocaleFromPathname, withLocale } from "@/lib/i18n";
import { translateTopicLabel } from "@/lib/topicLabels";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface TopicGroup {
    _id: string;
    count: number;
}

export default function TopicsPage() {
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname || "/");
    const [topics, setTopics] = useState<TopicGroup[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await fetch(`${API_URL}/qa/topics-list?lang=${locale}`);
                const data = await res.json();
                setTopics(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch topics", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTopics();
    }, [locale]);

    return (
        <main className="min-h-screen bg-ivory text-primary selection:bg-accent/30">
            <Navbar />

            <section className="pt-28 pb-14 md:pt-36 md:pb-18 px-6 md:px-12 bg-sand">
                <div className="max-w-7xl mx-auto">
                    <span className="inline-block px-5 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-accent/20">
                        {locale === "ur" ? "\u0639\u0644\u0645\u06cc \u0632\u0645\u0631\u06c1 \u062c\u0627\u062a" : "Knowledge Categories"}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-4">
                        {locale === "ur" ? "\u0645\u0648\u0636\u0648\u0639\u0627\u062a \u06a9\u06d2 \u0645\u0637\u0627\u0628\u0642 " : "Browse by "}
                        <span className="text-accent">{locale === "ur" ? "\u062f\u06cc\u06a9\u06be\u06cc\u06ba" : "Topics"}</span>
                    </h1>
                    <p className="text-foreground/50 max-w-xl text-sm md:text-base">
                        {locale === "ur"
                            ? "\u0645\u0641\u062a\u06cc \u0637\u0627\u0631\u0642 \u0645\u0633\u0639\u0648\u062f \u06a9\u06d2 \u0645\u0648\u0636\u0648\u0639\u0627\u062a \u06a9\u06d2 \u0645\u0637\u0627\u0628\u0642 \u0645\u0646\u0638\u0645 \u0627\u0633\u0644\u0627\u0645\u06cc \u0633\u0648\u0627\u0644 \u0648 \u062c\u0648\u0627\u0628 \u062f\u0631\u06cc\u0627\u0641\u062a \u06a9\u0631\u06cc\u06ba\u06d4"
                            : "Explore Islamic rulings and answers organized by topic categories as discussed by Mufti Tariq Masood."}
                    </p>
                </div>
            </section>

            <section className="py-12 md:py-16 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-24">
                            <Loader2 size={32} className="animate-spin text-accent" />
                        </div>
                    ) : topics.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-3xl border border-accent/10">
                            <BookOpen size={56} className="mx-auto text-accent/15 mb-4" />
                            <h3 className="text-xl font-serif font-bold text-primary/60 mb-2">
                                {locale === "ur" ? "\u0627\u0628\u06be\u06cc \u06a9\u0648\u0626\u06cc \u0645\u0648\u0636\u0648\u0639 \u0645\u0648\u062c\u0648\u062f \u0646\u06c1\u06cc\u06ba" : "No topics yet"}
                            </h3>
                            <p className="text-foreground/35 text-sm">
                                {locale === "ur"
                                    ? "\u0627\u06cc\u0688\u0645\u0646 \u067e\u06cc\u0646\u0644 \u0633\u06d2 \u0633\u0648\u0627\u0644 \u0648 \u062c\u0648\u0627\u0628 \u0634\u0627\u0645\u0644 \u06c1\u0648\u0646\u06d2 \u06a9\u06d2 \u0628\u0639\u062f \u06cc\u06c1\u0627\u06ba \u0645\u0648\u0636\u0648\u0639\u0627\u062a \u062f\u06a9\u06be\u0627\u0626\u06cc \u062f\u06cc\u06ba \u06af\u06d2\u06d4"
                                    : "Topics will appear here once Q&A entries are added from the admin panel."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {topics.map((topic) => (
                                <Link
                                    key={topic._id}
                                    href={withLocale(`/topics/${topic._id.toLowerCase().replace(/\s+/g, "-")}`, locale)}
                                    className="group bg-white rounded-2xl border border-accent/10 p-7 hover:shadow-xl hover:shadow-accent/5 hover:-translate-y-1 transition-all duration-300"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                                            <Tag size={20} className="text-accent" />
                                        </div>
                                        <ArrowRight size={16} className="text-accent/30 group-hover:text-accent group-hover:translate-x-1 transition-all mt-2" />
                                    </div>
                                    <h3 className="text-xl font-serif font-bold text-primary group-hover:text-accent transition-colors mb-2">
                                        {translateTopicLabel(topic._id, locale)}
                                    </h3>
                                    <p className="text-sm text-foreground/40 font-medium">
                                        {locale === "ur"
                                            ? `${topic.count} \u0633\u0648\u0627\u0644`
                                            : `${topic.count} question${topic.count !== 1 ? "s" : ""}`}
                                    </p>
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
