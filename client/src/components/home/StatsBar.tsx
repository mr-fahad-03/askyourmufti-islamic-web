"use client";

import React from "react";
import { motion } from "framer-motion";
import { Search, MessageSquare, Video, Globe } from "lucide-react";
import { usePathname } from "next/navigation";
import { getLocaleFromPathname } from "@/lib/i18n";
import { t } from "@/lib/messages";

export const StatsBar = () => {
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname || "/");
    const STATS = [
        { label: t(locale, "stats.archived_questions"), value: "25,000+", icon: MessageSquare },
        { label: t(locale, "stats.lecture_sessions"), value: "1,200+", icon: Video },
        { label: t(locale, "stats.active_languages"), value: "5", icon: Globe },
        { label: t(locale, "stats.search_queries"), value: "500k+", icon: Search },
    ];

    return (
        <div className="relative z-10 -mt-12 max-w-6xl mx-auto px-4 md:px-6">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 md:p-10 shadow-xl border border-accent/15 overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute bottom-0 right-0 w-56 h-56 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
                    {STATS.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.15 }}
                            className={`flex flex-col items-center text-center group ${index !== STATS.length - 1 ? "lg:border-r border-accent/15" : ""}`}
                        >
                            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-4 group-hover:bg-accent/20 transition-colors border border-accent/20">
                                <stat.icon size={22} strokeWidth={1.5} />
                            </div>
                            <div className="text-3xl md:text-4xl font-serif font-bold text-primary mb-1.5">
                                {stat.value}
                            </div>
                            <div className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-accent">
                                {stat.label}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
