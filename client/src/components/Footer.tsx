"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Youtube, Twitter, Facebook, Instagram, Mail, ArrowUpRight, Heart } from "lucide-react";
import Link from "next/link";
import { getLocaleFromPathname, withLocale } from "@/lib/i18n";
import { t } from "@/lib/messages";
import { translateTopicLabel } from "@/lib/topicLabels";

const SOCIALS = [
    { icon: Youtube, href: "#", label: "YouTube" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
];

export const Footer = () => {
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname || "/");
    const localize = (path: string) => withLocale(path, locale);

    const navLinks = [
        { label: t(locale, "nav.home"), href: localize("/") },
        { label: t(locale, "nav.about"), href: localize("/about") },
        { label: t(locale, "nav.sessions"), href: localize("/sessions") },
        { label: t(locale, "nav.topics"), href: localize("/topics") },
        { label: t(locale, "nav.search"), href: localize("/search") },
        { label: t(locale, "nav.contact"), href: localize("/contact") },
    ];

    const topicLinks = [
        { label: translateTopicLabel("salah-worship", locale), href: localize("/topics/salah-worship") },
        { label: translateTopicLabel("zakat-finance", locale), href: localize("/topics/zakat-finance") },
        { label: translateTopicLabel("marriage-family", locale), href: localize("/topics/marriage-family") },
        { label: translateTopicLabel("business-halal-income", locale), href: localize("/topics/business-halal-income") },
        { label: translateTopicLabel("women-hijab", locale), href: localize("/topics/women-hijab") },
        { label: translateTopicLabel("social-issues", locale), href: localize("/topics/social-issues") },
    ];

    return (
        <footer className="bg-white/80 backdrop-blur-2xl border-t border-accent/10 relative overflow-hidden">
            <div className="absolute -top-20 right-10 w-72 h-72 bg-accent/[0.04] rounded-full pointer-events-none" />
            <div className="absolute -bottom-16 left-16 w-56 h-56 bg-primary/[0.03] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-14">
                    <div className="lg:col-span-4">
                        <Link href={localize("/")} className="flex items-center gap-3 mb-5 group">
                            <div className="w-11 h-11 bg-accent rounded-xl flex items-center justify-center text-white font-serif font-bold text-lg group-hover:rotate-6 transition-transform shadow-lg shadow-accent/20">
                                TM
                            </div>
                            <div>
                                <span className="font-serif font-bold text-xl text-primary leading-none block">AskYourMufti</span>
                                <span className="text-[10px] uppercase tracking-[0.2em] leading-none block text-accent mt-1">{t(locale, "footer.brand_tag")}</span>
                            </div>
                        </Link>
                        <p className="text-sm leading-relaxed mb-7 max-w-xs text-gray-500">{locale === "ur" ? "\u0645\u0641\u062a\u06cc \u0637\u0627\u0631\u0642 \u0645\u0633\u0639\u0648\u062f \u06a9\u06cc \u062a\u0639\u0644\u06cc\u0645\u0627\u062a \u06a9\u0627 \u062c\u0627\u0645\u0639 \u0688\u06cc\u062c\u06cc\u0679\u0644 \u0622\u0631\u06a9\u0627\u0626\u06cc\u0648\u060c \u0633\u0648\u0627\u0644 \u0648 \u062c\u0648\u0627\u0628 \u0627\u0648\u0631 \u0644\u06cc\u06a9\u0686\u0631\u0632 \u06a9\u06cc \u0645\u0646\u0638\u0645 \u0634\u06a9\u0644 \u0645\u06cc\u06ba\u06d4" : t(locale, "footer.brand_desc")}</p>

                        <div className="flex gap-3">
                            {SOCIALS.map((social) => (
                                <Link
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-xl border border-accent/20 flex items-center justify-center text-accent hover:bg-accent hover:text-white hover:border-accent transition-all duration-300"
                                >
                                    <social.icon size={17} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="lg:col-span-2">
                        <h4 className="font-bold text-accent text-xs uppercase tracking-[0.2em] mb-6">{t(locale, "footer.navigation")}</h4>
                        <ul className="flex flex-col gap-3.5">
                            {navLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-gray-500 hover:text-accent transition-colors duration-200 flex items-center gap-2 group/link">
                                        <span className="w-1 h-1 rounded-full bg-accent/25 group-hover/link:bg-accent transition-colors" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <h4 className="font-bold text-accent text-xs uppercase tracking-[0.2em] mb-6">{t(locale, "footer.popular_topics")}</h4>
                        <ul className="flex flex-col gap-3.5">
                            {topicLinks.map((link) => (
                                <li key={link.label}>
                                    <Link href={link.href} className="text-sm text-gray-500 hover:text-accent transition-colors duration-200 flex items-center gap-2 group/link">
                                        <span className="w-1 h-1 rounded-full bg-accent/25 group-hover/link:bg-accent transition-colors" />
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="lg:col-span-3">
                        <div className="bg-sand/80 backdrop-blur-sm rounded-2xl p-7 border border-accent/10">
                            <h4 className="font-bold text-accent text-xs uppercase tracking-[0.2em] mb-3">{t(locale, "footer.stay_connected")}</h4>
                            <p className="text-xs text-gray-500 mb-5 leading-relaxed">{t(locale, "footer.subscribe_desc")}</p>
                            <div className="flex flex-col gap-3">
                                <input
                                    type="email"
                                    placeholder="your@email.com"
                                    className="bg-white border border-accent/15 text-sm px-4 py-3 rounded-xl focus:ring-2 focus:ring-accent/20 focus:border-accent/30 outline-none text-primary placeholder:text-foreground/25 transition-all"
                                />
                                <button className="w-full bg-accent text-white font-bold py-3 rounded-xl hover:bg-accent-light transition-colors text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-accent/15">
                                    {t(locale, "footer.subscribe")} <Mail size={14} />
                                </button>
                            </div>
                            <Link href={localize("/ask")} className="mt-4 flex items-center gap-1.5 text-xs text-gray-400 hover:text-accent transition-colors">
                                {t(locale, "footer.ask_direct")} <ArrowUpRight size={12} />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="h-[1px] bg-gradient-to-r from-transparent via-accent/15 to-transparent mb-6" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-gray-400 tracking-wide">
                        (c) {new Date().getFullYear()} AskYourMufti - {t(locale, "footer.rights")}
                    </p>
                    <div className="flex items-center gap-6 text-xs text-gray-400">
                        <Link href="#" className="hover:text-accent transition-colors">{t(locale, "footer.terms")}</Link>
                        <Link href="#" className="hover:text-accent transition-colors">{t(locale, "footer.privacy")}</Link>
                        <span className="flex items-center gap-1">
                            {t(locale, "footer.built_with")} <Heart size={10} className="text-accent" fill="currentColor" /> {t(locale, "footer.for_ummah")}
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

