"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
    Send,
    BookOpen,
    ShieldCheck,
    Clock,
    HelpCircle,
    ChevronDown,
    CheckCircle2,
    AlertCircle,
    MessageCircle,
    ChevronRight,
} from "lucide-react";
import { getLocaleFromPathname, withLocale } from "@/lib/i18n";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AskPage() {
    const pathname = usePathname();
    const locale = getLocaleFromPathname(pathname || "/");
    const isUr = locale === "ur";

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        category: "",
        preferredLanguage: locale,
        question: "",
        consent: false,
    });
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

    const guidelines = isUr
        ? [
            { icon: BookOpen, title: "واضح سوال لکھیں", desc: "سوال کے ساتھ مکمل پس منظر دیں تاکہ درست جواب دیا جا سکے۔" },
            { icon: ShieldCheck, title: "مہذب زبان", desc: "ادب اور احترام کے ساتھ سوال ارسال کریں۔" },
            { icon: Clock, title: "جواب کا وقت", desc: "اکثر جوابات 7 سے 14 دن میں سیشن یا آرکائیو میں شامل ہوتے ہیں۔" },
            { icon: HelpCircle, title: "پہلے تلاش کریں", desc: "ممکن ہے آپ کا سوال پہلے سے موجود ہو۔" },
        ]
        : [
            { icon: BookOpen, title: "Be Specific", desc: "Provide clear context so the scholar can give an accurate answer." },
            { icon: ShieldCheck, title: "Respectful Language", desc: "Use polite language befitting an Islamic knowledge-seeking environment." },
            { icon: Clock, title: "Response Time", desc: "Most answers are addressed in upcoming sessions or published within 7-14 days." },
            { icon: HelpCircle, title: "Check Existing Answers", desc: "Search the archive first because your question may already be answered." },
        ];

    const categories = isUr
        ? ["زمرہ منتخب کریں", "نماز و عبادات", "روزہ و رمضان", "زکوٰۃ و صدقات", "حج و عمرہ", "نکاح و خاندان", "کاروبار و مالیات", "روزمرہ زندگی و اخلاقیات", "عقیدہ و ایمانیات", "قرآن و تفسیر", "حدیث و سنت", "دیگر"]
        : ["Select a Category", "Salah & Worship", "Fasting & Ramadan", "Zakat & Charity", "Hajj & Umrah", "Marriage & Family", "Business & Finance", "Daily Life & Ethics", "Aqeedah & Beliefs", "Quran & Tafseer", "Hadith & Sunnah", "Other"];

    const faqItems = isUr
        ? [
            { q: "جواب آنے میں کتنا وقت لگتا ہے؟", a: "اکثر سوالات کا جواب 7 سے 14 دن میں دے دیا جاتا ہے۔" },
            { q: "کیا میں اردو یا جرمن میں سوال کر سکتا ہوں؟", a: "جی ہاں، انگریزی، اردو، جرمن، فرانسیسی اور ہسپانوی زبانیں دستیاب ہیں۔" },
            { q: "کیا میری ذاتی معلومات شیئر ہوں گی؟", a: "نہیں، ذاتی معلومات نجی رہتی ہیں۔ صرف غیر شناختی صورت میں سوال شائع ہو سکتا ہے۔" },
            { q: "کیا میں فالو اپ سوال پوچھ سکتا ہوں؟", a: "جی ہاں، اپنے اصل سوال کا حوالہ دے کر فالو اپ پوچھ سکتے ہیں۔" },
        ]
        : [
            { q: "How long does it take to get an answer?", a: "Most questions are addressed within 7-14 days in a session or archive post." },
            { q: "Can I ask in Urdu or German?", a: "Yes. Questions are accepted in English, Urdu, German, French, and Spanish." },
            { q: "Will my personal information be shared?", a: "No. Questions are handled confidentially and can be anonymized before publishing." },
            { q: "Can I ask follow-up questions?", a: "Yes. Include your original question reference for continuity." },
        ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage(null);

        try {
            const res = await fetch(`${API_URL}/asked-questions`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setMessage({
                    type: "error",
                    text: data.message || (isUr ? "سوال جمع نہیں ہو سکا۔" : "Question could not be submitted."),
                });
                return;
            }

            setMessage({
                type: "success",
                text: isUr ? "آپ کا سوال کامیابی سے جمع ہو گیا ہے۔" : "Your question has been submitted successfully.",
            });

            setFormData({
                fullName: "",
                email: "",
                category: "",
                preferredLanguage: locale,
                question: "",
                consent: false,
            });
        } catch {
            setMessage({
                type: "error",
                text: isUr ? "نیٹ ورک مسئلہ۔ براہِ کرم دوبارہ کوشش کریں۔" : "Network issue. Please try again.",
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen bg-ivory text-primary selection:bg-accent/30">
            <Navbar />

            <section className="pt-28 pb-14 md:pt-36 md:pb-16 px-6 md:px-12 bg-sand">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center gap-2 text-xs text-foreground/40 mb-6 font-medium flex-wrap">
                        <Link href={withLocale("/", locale)} className="hover:text-accent transition-colors">Home</Link>
                        <ChevronRight size={12} />
                        <span className="text-accent">{isUr ? "سوال پوچھیں" : "Ask a Question"}</span>
                    </div>

                    <span className="inline-flex items-center gap-2 px-5 py-2 bg-accent/10 text-accent rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-4 border border-accent/20">
                        <MessageCircle size={14} />
                        {isUr ? "اپنا سوال جمع کریں" : "Submit Your Question"}
                    </span>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary mb-4 leading-tight">
                        {isUr ? "مفتی طارق مسعود سے" : "Ask Mufti"} <span className="text-accent">{isUr ? "سوال پوچھیں" : "Tariq Masood"}</span>
                    </h1>
                    <p className="text-foreground/50 max-w-2xl text-sm md:text-base leading-relaxed">
                        {isUr
                            ? "اپنا اسلامی سوال بھیجیں اور قرآن و سنت کی روشنی میں جواب حاصل کریں۔"
                            : "Submit your Islamic question and receive an authentic answer rooted in the Quran and Sunnah."}
                    </p>
                </div>
            </section>

            <section className="py-12 md:py-16 px-6 md:px-12">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-accent/10 p-6 md:p-8 shadow-sm">
                        <div className="mb-8">
                            <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary">
                                {isUr ? "نیا سوال جمع کریں" : "Submit a New Question"}
                            </h2>
                            <p className="text-foreground/45 text-sm mt-2">
                                {isUr ? "نیچے فارم پُر کریں۔ * والی فیلڈز لازمی ہیں۔" : "Fill out the form below. Fields marked with * are required."}
                            </p>
                        </div>

                        <form className="space-y-6" onSubmit={handleSubmit}>
                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/50">{isUr ? "پورا نام" : "Full Name"} <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        required
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder={isUr ? "اپنا نام لکھیں" : "Your name"}
                                        className="w-full px-4 py-3 rounded-xl bg-ivory border border-accent/15 outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent/30 transition-all text-sm"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/50">{isUr ? "ای میل ایڈریس" : "Email Address"} <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 rounded-xl bg-ivory border border-accent/15 outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent/30 transition-all text-sm"
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/50">{isUr ? "زمرہ" : "Category"} <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <select
                                            required
                                            name="category"
                                            value={formData.category}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl bg-ivory border border-accent/15 outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent/30 transition-all text-sm appearance-none cursor-pointer"
                                        >
                                            {categories.map((cat, i) => (
                                                <option key={cat} value={i === 0 ? "" : cat}>{cat}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-accent/50 pointer-events-none" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-foreground/50">{isUr ? "پسندیدہ زبان" : "Preferred Language"}</label>
                                    <div className="relative">
                                        <select
                                            name="preferredLanguage"
                                            value={formData.preferredLanguage}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl bg-ivory border border-accent/15 outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent/30 transition-all text-sm appearance-none cursor-pointer"
                                        >
                                            <option value="en">English</option>
                                            <option value="ur">Urdu</option>
                                            <option value="de">Deutsch</option>
                                            <option value="fr">Francais</option>
                                            <option value="es">Espanol</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-accent/50 pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-foreground/50">{isUr ? "آپ کا سوال" : "Your Question"} <span className="text-red-500">*</span></label>
                                <textarea
                                    rows={8}
                                    required
                                    name="question"
                                    value={formData.question}
                                    onChange={handleInputChange}
                                    placeholder={isUr ? "اپنا سوال تفصیل سے لکھیں..." : "Please describe your question in detail..."}
                                    className="w-full px-4 py-3 rounded-xl bg-ivory border border-accent/15 outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent/30 transition-all text-sm resize-y"
                                />
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-sand rounded-xl border border-accent/10">
                                <input
                                    type="checkbox"
                                    id="consent"
                                    name="consent"
                                    checked={formData.consent}
                                    onChange={handleInputChange}
                                    required
                                    className="mt-1 accent-accent"
                                />
                                <label htmlFor="consent" className="text-sm text-foreground/60 leading-relaxed cursor-pointer">
                                    {isUr
                                        ? "میں سمجھتا/سمجھتی ہوں کہ میرا سوال غیر شناختی صورت میں شائع ہو سکتا ہے۔"
                                        : "I understand my question may be answered publicly in a session or published in the archive (anonymized)."}
                                </label>
                            </div>

                            {message && (
                                <div className={`rounded-xl px-4 py-3 text-sm font-medium border flex items-center gap-2 ${
                                    message.type === "success"
                                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                        : "bg-red-50 text-red-700 border-red-200"
                                }`}>
                                    {message.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                                    <span>{message.text}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full md:w-auto px-8 py-3.5 bg-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent-light transition-all shadow-lg shadow-accent/20 text-sm uppercase tracking-wider disabled:opacity-70"
                            >
                                {submitting
                                    ? (isUr ? "جمع کیا جا رہا ہے..." : "Submitting...")
                                    : (isUr ? "سوال جمع کریں" : "Submit Question")}
                                <Send size={16} />
                            </button>
                        </form>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-3xl border border-accent/10 p-6 shadow-sm">
                            <h3 className="text-lg font-serif font-bold text-primary mb-4">{isUr ? "سوال بھیجنے سے پہلے" : "Before You Submit"}</h3>
                            <div className="space-y-4">
                                {guidelines.map((item) => (
                                    <div key={item.title} className="flex items-start gap-3">
                                        <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent flex-shrink-0">
                                            <item.icon size={16} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-primary">{item.title}</h4>
                                            <p className="text-xs text-foreground/50 leading-relaxed mt-1">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white rounded-3xl border border-accent/10 p-6 shadow-sm">
                            <h3 className="text-lg font-serif font-bold text-primary mb-2">{isUr ? "پہلے سوال و جواب دیکھیں" : "Check Existing Answers"}</h3>
                            <p className="text-sm text-foreground/55 mb-4">
                                {isUr ? "ممکن ہے آپ کے سوال کا جواب پہلے سے آرکائیو میں موجود ہو۔" : "Your question may already be answered in the archive."}
                            </p>
                            <Link href={withLocale("/qa", locale)} className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:text-accent-light transition-colors">
                                {isUr ? "سوال و جواب دیکھیں" : "Browse Q&A"}
                                <ChevronRight size={14} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="pb-20 px-6 md:px-12">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-8">
                        <span className="text-accent font-bold text-sm tracking-[0.15em] uppercase">{isUr ? "عام سوالات" : "Common Questions"}</span>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-3">{isUr ? "پوچھنے سے پہلے" : "Before You Ask"}</h2>
                    </div>

                    <div className="space-y-4">
                        {faqItems.map((faq) => (
                            <details key={faq.q} className="group bg-white rounded-2xl border border-accent/10 overflow-hidden">
                                <summary className="flex items-center justify-between py-5 px-6 cursor-pointer list-none font-serif font-bold text-primary hover:text-accent transition-colors">
                                    {faq.q}
                                    <ChevronDown size={18} className="text-accent/50 group-open:rotate-180 transition-transform flex-shrink-0 ml-4" />
                                </summary>
                                <div className="px-6 pb-5 text-sm text-foreground/60 leading-relaxed -mt-1">{faq.a}</div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
