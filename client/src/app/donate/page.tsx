"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Heart, Building2, Copy, Check, BadgeCheck, ArrowRight, Landmark, HandHeart, BookOpen, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { getLocaleFromPathname, withLocale } from "@/lib/i18n";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface DonationAccount {
    _id: string;
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    iban: string;
    swiftBic: string;
    branchName: string;
    branchCode: string;
    currency: string;
    country: string;
    purpose: string;
    notes: string;
    isActive: boolean;
}

export default function DonatePage() {
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname || "/");
    const isUr = locale === "ur";

    const [accounts, setAccounts] = useState<DonationAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const res = await fetch(`${API_URL}/donations`);
                const data = await res.json();
                setAccounts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to load donation accounts", err);
            } finally {
                setLoading(false);
            }
        };
        fetchAccounts();
    }, []);

    const copyToClipboard = (text: string, fieldId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(fieldId);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const CopyButton = ({ text, id }: { text: string; id: string }) => (
        <button onClick={() => copyToClipboard(text, id)} className="ml-2 p-1.5 rounded-lg hover:bg-accent/10 transition-colors group flex-shrink-0" title={isUr ? "کاپی کریں" : "Copy"}>
            {copiedField === id ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} className="text-zinc-400 group-hover:text-accent transition-colors" />}
        </button>
    );

    const impactItems = isUr
        ? [
            { icon: BookOpen, title: "علم کی نشر", desc: "اسلامی لیکچرز کے ڈیجیٹل آرکائیو اور حفاظت میں مدد کریں۔" },
            { icon: Globe, title: "عالمی رسائی", desc: "ترجمہ اور سب ٹائٹلز کے ذریعے دنیا بھر تک فائدہ پہنچائیں۔" },
            { icon: HandHeart, title: "امت کی معاونت", desc: "مفت اسلامی تعلیم اور وسائل کے لیے حصہ ڈالیں۔" },
        ]
        : [
            { icon: BookOpen, title: "Spread Knowledge", desc: "Help digitize and preserve Islamic lectures for future generations." },
            { icon: Globe, title: "Reach the World", desc: "Enable translations and subtitles so Muslims worldwide can benefit." },
            { icon: HandHeart, title: "Support the Ummah", desc: "Fund free Islamic education and resources for communities in need." },
        ];

    return (
        <main className="min-h-screen bg-ivory">
            <Navbar />

            <section className="relative pt-32 pb-24 px-6 md:px-12 bg-white/80 backdrop-blur-xl border-b border-accent/10 overflow-hidden">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/[0.04] rounded-full -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-accent/[0.03] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />

                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <motion.span initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="inline-block px-5 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-6 border border-accent/20">
                        {isUr ? "مشن کی معاونت کریں" : "Support the Mission"}
                    </motion.span>
                    <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="text-4xl md:text-6xl font-serif font-bold text-gray-900 leading-tight mb-6">
                        {isUr ? "آپ کی سخاوت" : "Your Generosity"} <br />
                        <span className="text-accent">{isUr ? "علمِ دین کے فروغ کا ذریعہ ہے" : "Fuels Sacred Knowledge"}</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        {isUr ? "ہر تعاون مفتی طارق مسعود کی تعلیمات کو محفوظ کرنے اور عام کرنے میں مدد دیتا ہے۔" : "Every contribution helps preserve, translate, and share the teachings of Mufti Tariq Masood with the global Ummah."}
                    </motion.p>
                </div>
            </section>

            <section className="py-20 px-6 md:px-12 bg-ivory">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-8 items-start">
                    <div className="lg:col-span-2 lg:sticky lg:top-28">
                        <div className="bg-white rounded-3xl p-8 md:p-10 border border-accent/10 shadow-sm">
                            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-6"><Heart size={22} className="text-accent" fill="currentColor" /></div>
                            <p className="text-xl md:text-2xl font-serif italic text-gray-700 leading-relaxed mb-4">{isUr ? "صدقہ قیامت کے دن مومن کا سایہ بنے گا۔" : "The believer's shade on the Day of Resurrection will be his charity."}</p>
                            <p className="text-sm text-accent font-bold tracking-wide uppercase">{isUr ? "Hadith" : "Hadith"}</p>
                            <div className="mt-8 pt-6 border-t border-accent/10">
                                <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-xs font-bold tracking-[0.15em] uppercase mb-3 border border-accent/20">{isUr ? "بینک ٹرانسفر" : "Bank Transfer"}</span>
                                <p className="text-sm text-gray-500 leading-relaxed">{isUr ? "براہِ راست ٹرانسفر کے لیے نیچے دی گئی بینک تفصیلات استعمال کریں۔" : "Use the bank details below for direct transfer. Click any field to copy it."}</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-8">{isUr ? "بینک ٹرانسفر کے ذریعے عطیہ" : "Donate via Bank Transfer"}</h2>

                        {loading ? (
                            <div className="text-gray-500">{isUr ? "لوڈ ہو رہا ہے..." : "Loading..."}</div>
                        ) : accounts.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-3xl border border-accent/10">
                                <Landmark size={56} className="mx-auto text-zinc-200 mb-4" />
                                <h3 className="text-xl font-bold text-gray-400 mb-2">{isUr ? "کوئی اکاؤنٹ دستیاب نہیں" : "No Accounts Available"}</h3>
                                <p className="text-gray-400 text-sm">{isUr ? "اکاؤنٹس سیٹ ہونے کے بعد یہاں ظاہر ہوں گے۔" : "Donation accounts will be displayed here once set up."}</p>
                            </div>
                        ) : (
                            <div className="grid gap-6">
                                {accounts.map((acc, index) => (
                                    <motion.div key={acc._id} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.1 }} className="bg-white rounded-3xl border border-accent/10 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                                        <div className="bg-gradient-to-r from-accent/10 via-accent/5 to-transparent p-6 md:p-8 flex items-center gap-4 border-b border-accent/10">
                                            <div className="w-14 h-14 rounded-2xl bg-ivory flex items-center justify-center shadow-sm border border-accent/10"><Building2 size={24} className="text-accent" /></div>
                                            <div><h3 className="text-xl font-serif font-bold text-gray-900">{acc.bankName}</h3><div className="flex items-center gap-2 mt-1"><span className="text-sm text-gray-500">{acc.country}</span><span className="text-sm font-semibold text-accent">{acc.currency}</span></div></div>
                                            <div className="ml-auto hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-200"><BadgeCheck size={14} className="text-emerald-600" /><span className="text-xs font-bold text-emerald-700">{isUr ? "تصدیق شدہ" : "Verified"}</span></div>
                                        </div>

                                        <div className="p-6 md:p-8 grid md:grid-cols-2 gap-y-5 gap-x-8">
                                            <div className="flex flex-col gap-1"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{isUr ? "اکاؤنٹ ہولڈر" : "Account Holder"}</span><div className="flex items-center gap-2"><span className="text-gray-900 font-semibold">{acc.accountHolder}</span><CopyButton text={acc.accountHolder} id={`holder-${acc._id}`} /></div></div>
                                            <div className="flex flex-col gap-1"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{isUr ? "اکاؤنٹ نمبر" : "Account Number"}</span><div className="flex items-center gap-2"><span className="text-gray-900 font-mono font-semibold tracking-wide">{acc.accountNumber}</span><CopyButton text={acc.accountNumber} id={`accno-${acc._id}`} /></div></div>
                                            {!!acc.iban && <div className="flex flex-col gap-1"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">IBAN</span><div className="flex items-center gap-2"><span className="text-gray-900 font-mono font-semibold tracking-wide text-sm">{acc.iban}</span><CopyButton text={acc.iban} id={`iban-${acc._id}`} /></div></div>}
                                            {!!acc.swiftBic && <div className="flex flex-col gap-1"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">SWIFT / BIC</span><div className="flex items-center gap-2"><span className="text-gray-900 font-mono font-semibold tracking-wide">{acc.swiftBic}</span><CopyButton text={acc.swiftBic} id={`swift-${acc._id}`} /></div></div>}
                                            {!!acc.branchName && <div className="flex flex-col gap-1"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{isUr ? "برانچ" : "Branch"}</span><span className="text-gray-900 font-semibold">{acc.branchName}{acc.branchCode && <span className="text-gray-400 font-normal ml-2">({acc.branchCode})</span>}</span></div>}
                                            {!!acc.purpose && <div className="flex flex-col gap-1"><span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{isUr ? "ریفرنس / مقصد" : "Reference / Purpose"}</span><div className="flex items-center gap-2"><span className="text-gray-900 font-semibold">{acc.purpose}</span><CopyButton text={acc.purpose} id={`purpose-${acc._id}`} /></div></div>}
                                        </div>

                                        {!!acc.notes && <div className="px-6 md:px-8 pb-6 md:pb-8"><div className="bg-ivory rounded-2xl p-4 border border-accent/10"><p className="text-sm text-gray-500 leading-relaxed"><span className="font-bold text-gray-700">{isUr ? "نوٹ:" : "Note:"} </span>{acc.notes}</p></div></div>}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 md:px-12 bg-white border-t border-accent/10">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-3">{isUr ? "آپ کے عطیے کا اثر" : "Your Impact"}</h2>
                        <p className="text-gray-500 max-w-xl mx-auto">{isUr ? "آپ کا عطیہ دنیا بھر میں اسلامی تعلیم کے فروغ میں مدد کرتا ہے۔" : "Here is how your donation makes a difference in the lives of Muslims around the world."}</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {impactItems.map((item, i) => (
                            <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="bg-ivory rounded-3xl p-8 border border-accent/10 shadow-sm hover:shadow-md hover:border-accent/20 transition-all group">
                                <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-5 group-hover:bg-accent/20 transition-colors"><item.icon size={24} className="text-accent" /></div>
                                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 md:px-12 bg-ivory">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto text-center bg-white rounded-3xl p-10 md:p-14 border border-accent/10 shadow-sm">
                    <Heart size={40} className="mx-auto text-accent mb-6" fill="currentColor" />
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">{isUr ? "JazakAllah Khair" : "JazakAllah Khair"}</h2>
                    <p className="text-gray-500 max-w-lg mx-auto leading-relaxed mb-8">{isUr ? "اللہ آپ کی سخاوت قبول فرمائے۔" : "May Allah accept your generosity and multiply your reward."}</p>
                    <a href={withLocale("/contact", locale)} className="inline-flex items-center gap-2 px-8 py-3.5 bg-accent text-white font-bold rounded-full shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 hover:-translate-y-0.5 transition-all">{isUr ? "سوال؟ رابطہ کریں" : "Questions? Contact Us"} <ArrowRight size={16} /></a>
                </motion.div>
            </section>

            <Footer />
        </main>
    );
}
