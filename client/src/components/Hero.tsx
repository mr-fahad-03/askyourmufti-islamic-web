"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Search, BookOpen, MessageCircle } from "lucide-react";
import { getLocaleFromPathname, withLocale } from "@/lib/i18n";
import { t } from "@/lib/messages";

export const Hero = () => {
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname || "/");
    const localize = (path: string) => withLocale(path, locale);

    return (
        <section className="relative min-h-screen flex items-center overflow-hidden">
            <div className="absolute inset-0 z-0">
                <video autoPlay loop muted playsInline className="w-full h-full object-cover">
                    <source src="/background.mp4" type="video/mp4" />
                </video>
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 py-32">
                <div className="grid lg:grid-cols-5 gap-10 items-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="lg:col-span-3 text-center lg:text-left"
                    >
                        <motion.span
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="inline-block px-5 py-2 bg-accent/20 text-accent rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-8 border border-accent/30"
                        >
                            ✦ {t(locale, "hero.badge")} ✦
                        </motion.span>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-primary leading-[1.15] mb-6">
                            {t(locale, "hero.title.line1")}{" "}
                            <span className="text-accent italic">{t(locale, "hero.title.highlight")}</span>
                            <br />
                            {t(locale, "hero.title.line2")}
                        </h1>

                        <p className="text-base md:text-lg text-primary-dark/80 max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0">
                            {t(locale, "hero.subtitle")}
                        </p>

                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                <Link
                                    href={localize("/topics")}
                                    className="flex items-center gap-3 px-6 py-3.5 bg-accent hover:bg-accent-light text-white rounded-xl font-semibold transition-colors shadow-lg shadow-accent/25"
                                >
                                    <BookOpen size={18} />
                                    {t(locale, "hero.cta.topics")}
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                <Link
                                    href={localize("/sessions")}
                                    className="flex items-center gap-3 px-6 py-3.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-semibold backdrop-blur-sm border border-primary/30 transition-colors"
                                >
                                    <Search size={18} />
                                    {t(locale, "hero.cta.sessions")}
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                                <Link
                                    href={localize("/ask")}
                                    className="flex items-center gap-3 px-6 py-3.5 bg-primary/10 hover:bg-primary/20 text-primary rounded-xl font-semibold backdrop-blur-sm border border-primary/30 transition-colors"
                                >
                                    <MessageCircle size={18} />
                                    {t(locale, "hero.cta.ask")}
                                </Link>
                            </motion.div>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className="lg:col-span-2 flex justify-center"
                    >
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-accent/20 blur-2xl scale-110" />
                            <div className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] rounded-full overflow-hidden border-[3px] border-accent/60 shadow-2xl shadow-black/30">
                                <Image src="/hero-img.webp" alt="Mufti Tariq Masood" fill className="object-cover" priority />
                            </div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 }}
                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-primary/90 backdrop-blur-md text-white px-6 py-2 rounded-full text-sm font-semibold whitespace-nowrap border border-white/10 shadow-lg"
                            >
                                Mufti Tariq Masood
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
            >
                <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-primary/40">{t(locale, "hero.scroll")}</span>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="w-5 h-8 rounded-full border-2 border-primary/30 flex items-start justify-center pt-1.5"
                >
                    <div className="w-1 h-1.5 bg-primary/60 rounded-full" />
                </motion.div>
            </motion.div>
        </section>
    );
};
