"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname, withLocale } from "@/lib/i18n";
import { translateTopicLabel } from "@/lib/topicLabels";
import {
    BookOpen,
    Landmark,
    Briefcase,
    Heart,
    ShieldCheck,
    Dices,
    Users,
    FileText,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const FALLBACK_TOPICS = [
    { name: "Salah & Worship", slug: "salah-worship" },
    { name: "Zakat & Finance", slug: "zakat-finance" },
    { name: "Business & Halal Income", slug: "business-halal-income" },
    { name: "Marriage & Family", slug: "marriage-family" },
    { name: "Women & Hijab", slug: "women-hijab" },
    { name: "Gambling & Sports", slug: "gambling-sports" },
    { name: "Social Issues", slug: "social-issues" },
    { name: "Trade & Contracts", slug: "trade-contracts" },
];

const ICONS = [BookOpen, Landmark, Briefcase, Heart, ShieldCheck, Dices, Users, FileText];
const GRADIENTS = [
    "from-emerald-600 to-teal-500",
    "from-amber-600 to-yellow-500",
    "from-blue-600 to-indigo-500",
    "from-rose-600 to-pink-500",
    "from-purple-600 to-violet-500",
    "from-red-600 to-orange-500",
    "from-cyan-600 to-sky-500",
    "from-lime-600 to-green-500",
];
const GLOWS = [
    "shadow-emerald-500/30",
    "shadow-amber-500/30",
    "shadow-blue-500/30",
    "shadow-rose-500/30",
    "shadow-purple-500/30",
    "shadow-red-500/30",
    "shadow-cyan-500/30",
    "shadow-lime-500/30",
];

interface TopicItem {
    _id: string;
    name: string;
    slug: string;
}

const TopicCard = ({
    topic,
    index,
    locale,
}: {
    topic: { name: string; slug: string };
    index: number;
    locale: "en" | "ur" | "de" | "fr" | "es";
}) => (
    <Link
        href={withLocale(`/topics/${topic.slug}`, locale)}
        className="flex-shrink-0 flex flex-col items-center group w-[140px] md:w-[160px]"
    >
        <div
            className={`relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-gradient-to-br ${GRADIENTS[index % GRADIENTS.length]} flex items-center justify-center shadow-lg ${GLOWS[index % GLOWS.length]} group-hover:scale-110 group-hover:shadow-xl transition-all duration-500 border-[3px] border-white/30`}
        >
            <div className="absolute inset-1 rounded-full border border-white/20" />
            {React.createElement(ICONS[index % ICONS.length], {
                size: 32,
                className: "text-white drop-shadow-md md:w-9 md:h-9",
                strokeWidth: 1.8,
            })}
        </div>

        <span className="mt-4 text-sm md:text-base font-bold text-primary text-center leading-tight group-hover:text-accent transition-colors duration-300">
            {translateTopicLabel(topic.name, locale)}
        </span>
    </Link>
);

export const TopicsMarquee = () => {
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname || "/");
    const trackRef = useRef<HTMLDivElement>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [topics, setTopics] = useState(FALLBACK_TOPICS);
    const scrollPos = useRef(0);
    const speed = 0.5;

    useEffect(() => {
        let rafId = 0;
        const animate = () => {
            if (!trackRef.current) return;
            if (!isPaused) {
                scrollPos.current += speed;
                const halfWidth = trackRef.current.scrollWidth / 2;
                if (scrollPos.current >= halfWidth) {
                    scrollPos.current = 0;
                }
                trackRef.current.style.transform = `translateX(-${scrollPos.current}px)`;
            }
            rafId = requestAnimationFrame(animate);
        };

        rafId = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafId);
    }, [isPaused]);

    useEffect(() => {
        const fetchTopics = async () => {
            try {
                const res = await fetch(`${API_URL}/topics`);
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    const mapped = (data as TopicItem[]).map((topic) => ({
                        name: topic.name,
                        slug: topic.slug || topic.name.toLowerCase().replace(/\s+/g, "-"),
                    }));
                    setTopics(mapped);
                }
            } catch (err) {
                console.error("Failed to load marquee topics", err);
            }
        };

        fetchTopics();
    }, []);

    return (
        <section className="py-16 md:py-20 overflow-hidden bg-ivory">
            <div className="text-center mb-12 px-6">
                <span className="inline-block px-5 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-accent/20">
                    {locale === "ur" ? "\u0632\u0645\u0631\u06d2 \u062f\u06cc\u06a9\u06be\u06cc\u06ba" : locale === "de" ? "Kategorien" : locale === "fr" ? "Cat\u00e9gories" : locale === "es" ? "Categor\u00edas" : "Explore Categories"}
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
                    {locale === "ur" ? "\u0645\u0648\u0636\u0648\u0639\u0627\u062a \u06a9\u06d2 \u0645\u0637\u0627\u0628\u0642 " : locale === "de" ? "Nach " : locale === "fr" ? "Par " : locale === "es" ? "Por " : "Browse by "}
                    <span className="text-accent">
                        {locale === "ur" ? "\u0645\u0648\u0636\u0648\u0639\u0627\u062a" : locale === "de" ? "Themen" : locale === "fr" ? "Th\u00e8mes" : locale === "es" ? "Temas" : "Topics"}
                    </span>
                </h2>
                <p className="text-foreground/50 mt-3 max-w-lg mx-auto text-sm">
                    {locale === "ur"
                        ? "\u06c1\u0632\u0627\u0631\u0648\u06ba \u0645\u0633\u062a\u0646\u062f \u0633\u0648\u0627\u0644 \u0648 \u062c\u0648\u0627\u0628 \u062f\u06cc\u06a9\u06be\u0646\u06d2 \u06a9\u06d2 \u0644\u06cc\u06d2 \u0627\u06cc\u06a9 \u0645\u0648\u0636\u0648\u0639 \u0645\u0646\u062a\u062e\u0628 \u06a9\u0631\u06cc\u06ba"
                        : locale === "de"
                            ? "W\u00e4hlen Sie ein Thema, um tausende authentische Antworten zu sehen"
                            : locale === "fr"
                                ? "Choisissez un th\u00e8me pour explorer des milliers de r\u00e9ponses authentiques"
                                : locale === "es"
                                    ? "Seleccione un tema para explorar miles de respuestas aut\u00e9nticas"
                                    : "Select a topic to explore thousands of authentic Q&A answers"}
                </p>
            </div>

            <div className="relative" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
                <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-ivory to-transparent z-10 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-ivory to-transparent z-10 pointer-events-none" />

                <div ref={trackRef} className="flex w-max gap-10 md:gap-14 will-change-transform">
                    {topics.map((topic, index) => (
                        <TopicCard key={`a-${topic.slug}-${index}`} topic={topic} index={index} locale={locale} />
                    ))}
                    {topics.map((topic, index) => (
                        <TopicCard key={`b-${topic.slug}-${index}`} topic={topic} index={index} locale={locale} />
                    ))}
                </div>
            </div>
        </section>
    );
};
