"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import { BookOpen, Globe, Heart, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { getLocaleFromPathname } from "@/lib/i18n";

type Copy = {
    badge: string;
    title1: string;
    title2: string;
    subtitle: string;
    scholarLabel: string;
    scholarRole: string;
    missionBadge: string;
    missionTitle: string;
    journeyBadge: string;
    journeyTitle: string;
    stats: [string, string, string];
};

const COPY: Record<string, Copy> = {
    ur: {
        badge: "آرکائیو کے بارے میں",
        title1: "علمی ورثے کی",
        title2: "حفاظت",
        subtitle: "Archive.TM ایک منظم پلیٹ فارم ہے جہاں مفتی طارق مسعود کی تعلیمات محفوظ کی جاتی ہیں۔",
        scholarLabel: "محققِ دین",
        scholarRole: "اسلامی عالم اور فقیہ",
        missionBadge: "ہمارا مقصد",
        missionTitle: "ہم کس لیے کھڑے ہیں",
        journeyBadge: "ہمارا سفر",
        journeyTitle: "اہم سنگِ میل",
        stats: ["سوالات", "سیشنز", "زبانیں"],
    },
    en: {
        badge: "About the Archive",
        title1: "Preserving the Legacy of",
        title2: "Sacred Knowledge",
        subtitle: "Archive.TM is a dedicated platform to organize, preserve, and share the teachings of Mufti Tariq Masood.",
        scholarLabel: "The Scholar",
        scholarRole: "Islamic Scholar & Jurist",
        missionBadge: "Our Mission",
        missionTitle: "What We Stand For",
        journeyBadge: "Our Journey",
        journeyTitle: "Key Milestones",
        stats: ["Questions", "Sessions", "Languages"],
    },
};

const VALUES: Record<string, Array<{ icon: LucideIcon; title: string; desc: string }>> = {
    ur: [
        { icon: BookOpen, title: "مستند علم", desc: "قرآن، حدیث اور روایتی فقہ پر مبنی رہنمائی۔" },
        { icon: Heart, title: "سب کے لیے", desc: "آسان اور اوپن ایکسیس تاکہ ہر شخص مستفید ہو۔" },
        { icon: Globe, title: "عالمی رسائی", desc: "دنیا بھر کی مسلم کمیونٹیز کے لیے۔" },
        { icon: Star, title: "علمی معیار", desc: "ہر جواب تحقیقی اصولوں پر مبنی۔" },
    ],
    en: [
        { icon: BookOpen, title: "Authentic Knowledge", desc: "Rooted in the Quran, Hadith, and classical scholarship." },
        { icon: Heart, title: "Accessible to All", desc: "Free and open access to Islamic teachings for everyone." },
        { icon: Globe, title: "Global Reach", desc: "Serving Muslim communities across Europe, Asia, and beyond." },
        { icon: Star, title: "Scholarly Excellence", desc: "Every answer backed by rigorous research and methodology." },
    ],
};

const MILESTONES: Record<string, Array<{ year: string; title: string; desc: string }>> = {
    ur: [
        { year: "2010", title: "دعوت کا آغاز", desc: "مقامی دروس سے علمی سفر کا آغاز۔" },
        { year: "2015", title: "ڈیجیٹل توسیع", desc: "بیانات آن لائن ہوئے اور عالمی سامعین تک رسائی بڑھی۔" },
        { year: "2020", title: "عالمی پہچان", desc: "سوشل پلیٹ فارمز پر لاکھوں ناظرین تک رسائی۔" },
        { year: "2024", title: "Archive.TM آغاز", desc: "تعلیمات کو منظم اور محفوظ کرنے کے لیے ڈیجیٹل آرکائیو۔" },
    ],
    en: [
        { year: "2010", title: "Beginning of Dawah", desc: "Mufti Tariq Masood began spreading Islamic knowledge through local lectures." },
        { year: "2015", title: "Digital Expansion", desc: "Lectures were made available online to a global audience." },
        { year: "2020", title: "Global Recognition", desc: "Millions of viewers across YouTube and social media platforms." },
        { year: "2024", title: "Archive.TM Launch", desc: "A structured digital archive to preserve and organize teachings." },
    ],
};

export default function AboutPage() {
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname || "/");
    const copy = COPY[locale] || COPY.en;
    const values = VALUES[locale] || VALUES.en;
    const milestones = MILESTONES[locale] || MILESTONES.en;

    return (
        <main className="min-h-screen bg-ivory">
            <Navbar />

            <section className="relative pt-32 pb-24 px-6 md:px-12 bg-white/80 backdrop-blur-xl border-b border-accent/10 overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/[0.04] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-accent/[0.03] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <span className="inline-block px-5 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-6 border border-accent/20">{copy.badge}</span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 leading-tight mb-6">
                        {copy.title1} <br />
                        <span className="text-accent">{copy.title2}</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">{copy.subtitle}</p>
                </div>
            </section>

            <section className="py-20 px-6 md:px-12">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div className="relative">
                        <div className="relative w-full max-w-md mx-auto">
                            <div className="absolute -inset-4 bg-accent/[0.06] rounded-3xl -rotate-3" />
                            <div className="relative rounded-2xl overflow-hidden border-2 border-accent/20 shadow-2xl shadow-accent/10">
                                <Image src="/Tariq-about page.webp" alt="Mufti Tariq Masood" width={500} height={600} className="object-cover w-full" />
                                <div className="absolute bottom-5 left-5 bg-white/90 backdrop-blur-md rounded-xl px-5 py-3 border border-accent/15 shadow-lg">
                                    <span className="text-accent font-serif font-bold text-sm">Mufti Tariq Masood</span>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{copy.scholarRole}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span className="text-accent font-bold text-sm tracking-[0.15em] uppercase">{copy.scholarLabel}</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3 mb-6">Mufti Tariq Masood</h2>
                        <div className="space-y-4 text-gray-500 leading-relaxed">
                            <p>{locale === "ur" ? "مفتی طارق مسعود دین کے مشکل مسائل کو آسان اور عملی انداز میں بیان کرتے ہیں۔" : "Mufti Tariq Masood is a renowned Islamic scholar known for his clear and practical approach."}</p>
                            <p>{locale === "ur" ? "ان کی تعلیمات روایتی علم اور عصری مسائل کے درمیان مضبوط ربط پیدا کرتی ہیں۔" : "His work bridges classical scholarship with contemporary understanding for Muslims worldwide."}</p>
                            <p>{locale === "ur" ? "نماز، زکوٰۃ، نکاح، کاروبار اور روزمرہ زندگی سے متعلق سوالات کے جوابات یہاں دستیاب ہیں۔" : "From Salah and Zakat to marriage, finance, and everyday ethical issues, his lectures cover broad topics."}</p>
                        </div>
                        <div className="flex gap-8 mt-8 pt-8 border-t border-accent/15">
                            <div className="text-center"><div className="text-3xl font-serif font-bold text-accent">25K+</div><div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{copy.stats[0]}</div></div>
                            <div className="text-center"><div className="text-3xl font-serif font-bold text-accent">1.2K+</div><div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{copy.stats[1]}</div></div>
                            <div className="text-center"><div className="text-3xl font-serif font-bold text-accent">5</div><div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-1">{copy.stats[2]}</div></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 md:px-12 bg-sand">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-accent font-bold text-sm tracking-[0.15em] uppercase">{copy.missionBadge}</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3">{copy.missionTitle}</h2>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((item) => (
                            <div key={item.title} className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-accent/10 hover:border-accent/30 hover:shadow-lg transition-all group">
                                <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center text-accent mb-5 group-hover:bg-accent/20 transition-colors border border-accent/20"><item.icon size={24} strokeWidth={1.5} /></div>
                                <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 md:px-12 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-14">
                        <span className="text-accent font-bold text-sm tracking-[0.15em] uppercase">{copy.journeyBadge}</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-3">{copy.journeyTitle}</h2>
                    </div>
                    <div className="relative">
                        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-accent/20" />
                        <div className="space-y-12">
                            {milestones.map((item, index) => (
                                <div key={item.year} className={`relative flex items-center gap-8 ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}>
                                    <div className={`flex-1 ${index % 2 === 0 ? "md:text-right" : "md:text-left"} hidden md:block`}><div className="bg-ivory rounded-2xl p-6 border border-accent/10 shadow-sm inline-block"><div className="text-accent font-bold text-sm mb-1">{item.year}</div><h3 className="font-serif font-bold text-gray-900 text-lg mb-1">{item.title}</h3><p className="text-sm text-gray-500">{item.desc}</p></div></div>
                                    <div className="absolute left-8 md:left-1/2 -translate-x-1/2 w-4 h-4 bg-accent rounded-full border-4 border-white z-10" />
                                    <div className="flex-1 hidden md:block" />
                                    <div className="ml-16 md:hidden bg-ivory rounded-2xl p-6 border border-accent/10 shadow-sm"><div className="text-accent font-bold text-sm mb-1">{item.year}</div><h3 className="font-serif font-bold text-gray-900 text-lg mb-1">{item.title}</h3><p className="text-sm text-gray-500">{item.desc}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
