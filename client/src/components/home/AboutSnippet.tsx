"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BookOpen, Globe, Users } from "lucide-react";
import { getLocaleFromPathname, withLocale } from "@/lib/i18n";
import { t } from "@/lib/messages";

export const AboutSnippet = () => {
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname || "/");
    const localize = (path: string) => withLocale(path, locale);

    const highlights = [
        { icon: BookOpen, value: "25,000+", label: t(locale, "about.h1") },
        { icon: Globe, value: "5", label: t(locale, "about.h2") },
        { icon: Users, value: "500K+", label: t(locale, "about.h3") },
    ];

    return (
        <section className="py-20 md:py-28 px-6 md:px-12 bg-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent/[0.03] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/[0.03] rounded-full translate-y-1/2 -translate-x-1/3 pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="absolute -inset-4 bg-accent/[0.06] rounded-[2rem] -rotate-2" />
                        <div className="relative rounded-2xl overflow-hidden border-2 border-accent/15 shadow-2xl shadow-accent/10">
                            <Image
                                src="/Tariq-about page.webp"
                                alt="Mufti Tariq Masood"
                                width={600}
                                height={500}
                                className="object-cover w-full aspect-[4/3]"
                            />
                            <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md rounded-xl px-5 py-3 border border-accent/15 shadow-lg">
                                <span className="text-accent font-serif font-bold text-sm">Mufti Tariq Masood</span>
                                <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wider mt-0.5">Islamic Scholar & Jurist</p>
                            </div>
                        </div>
                    </div>

                    <div>
                        <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-[11px] font-bold tracking-[0.2em] uppercase mb-5 border border-accent/15">
                            {t(locale, "about.badge")}
                        </span>

                        <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-serif font-bold text-primary mb-5 leading-[1.2]">
                            {t(locale, "about.title.start")} <span className="text-accent">{t(locale, "about.title.end")}</span>
                        </h2>

                        <p className="text-foreground/50 text-base leading-relaxed mb-4">{t(locale, "about.p1")}</p>
                        <p className="text-foreground/40 text-sm leading-relaxed mb-8">{t(locale, "about.p2")}</p>

                        <div className="flex gap-8 mb-10 pb-8 border-b border-accent/10">
                            {highlights.map((item) => (
                                <div key={item.label} className="text-center">
                                    <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-accent/8 flex items-center justify-center text-accent border border-accent/15">
                                        <item.icon size={18} strokeWidth={1.8} />
                                    </div>
                                    <div className="text-xl font-serif font-bold text-primary leading-none">{item.value}</div>
                                    <div className="text-[10px] font-bold text-foreground/35 uppercase tracking-wider mt-1">{item.label}</div>
                                </div>
                            ))}
                        </div>

                        <Link
                            href={localize("/about")}
                            className="inline-flex items-center gap-2 px-7 py-3.5 bg-accent text-white rounded-xl font-bold text-sm tracking-wide hover:bg-accent-light transition-colors shadow-lg shadow-accent/20"
                        >
                            {t(locale, "about.cta")}
                            <ArrowUpRight size={16} />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};
