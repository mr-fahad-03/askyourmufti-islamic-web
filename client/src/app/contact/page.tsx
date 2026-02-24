import React from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Mail, Phone, MapPin, Send, Clock, MessageCircle, Globe } from "lucide-react";

const CONTACT_CARDS = [
    {
        icon: Mail,
        title: "Email Support",
        desc: "For technical issues or transcript requests.",
        detail: "support@tmarchive.com",
        link: "mailto:support@tmarchive.com",
    },
    {
        icon: MessageCircle,
        title: "WhatsApp Support",
        desc: "Direct contact for quick inquiries.",
        detail: "Official Support Line",
        link: "#",
    },
    {
        icon: MapPin,
        title: "Office Locations",
        desc: "Digital operations across two continents.",
        detail: "Germany / Pakistan",
        link: undefined,
    },
    {
        icon: Clock,
        title: "Support Hours",
        desc: "We respond within 24-48 hours.",
        detail: "Mon – Sat, 9 AM – 6 PM CET",
        link: undefined,
    },
];

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-ivory">
            <Navbar />

            {/* Hero Banner */}
            <section className="relative pt-28 pb-20 px-6 md:px-12 bg-primary-dark overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 right-16 w-56 h-56 border border-accent/30 rounded-full" />
                    <div className="absolute bottom-8 left-12 w-36 h-36 border border-accent/20 rounded-full" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[200px] font-serif text-accent/5">✦</div>
                </div>
                <div className="max-w-5xl mx-auto text-center relative z-10">
                    <span className="inline-block px-5 py-2 bg-accent/15 text-accent rounded-full text-xs font-bold tracking-[0.2em] uppercase mb-6 border border-accent/25">
                        Get in Touch
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight mb-6">
                        We&apos;d Love to <span className="text-accent">Hear From You</span>
                    </h1>
                    <p className="text-lg text-white/60 max-w-2xl mx-auto leading-relaxed">
                        Have a question about the archive, need technical support, or want to contribute? Reach out and our team will assist you.
                    </p>
                </div>
            </section>

            {/* Contact Cards */}
            <section className="py-16 px-6 md:px-12">
                <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-6 -mt-20 relative z-20">
                    {CONTACT_CARDS.map((card) => (
                        <div key={card.title} className="bg-white/90 backdrop-blur-sm rounded-2xl p-7 border border-accent/10 shadow-lg hover:shadow-xl hover:border-accent/30 transition-all group text-center">
                            <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center text-accent mx-auto mb-5 group-hover:bg-accent/20 transition-colors border border-accent/20">
                                <card.icon size={24} strokeWidth={1.5} />
                            </div>
                            <h3 className="text-lg font-serif font-bold text-primary mb-2">{card.title}</h3>
                            <p className="text-sm text-foreground/50 mb-3">{card.desc}</p>
                            {card.link ? (
                                <a href={card.link} className="text-accent font-bold text-sm hover:underline">{card.detail}</a>
                            ) : (
                                <span className="text-primary font-bold text-sm">{card.detail}</span>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Form + Map / Info */}
            <section className="py-12 pb-24 px-6 md:px-12">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-5 gap-12">

                    {/* Form */}
                    <div className="lg:col-span-3 bg-white/80 backdrop-blur-sm p-10 md:p-12 rounded-3xl border border-accent/10 shadow-sm">
                        <span className="text-accent font-bold text-sm tracking-[0.15em] uppercase">Send a Message</span>
                        <h2 className="text-2xl md:text-3xl font-serif font-bold text-primary mt-2 mb-8">
                            Contact the Archive Team
                        </h2>
                        <form className="space-y-6">
                            <div className="grid sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-accent/70">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="Your name"
                                        className="w-full px-5 py-4 rounded-xl bg-ivory border border-accent/15 outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent/30 transition-all text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold uppercase tracking-widest text-accent/70">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="your@email.com"
                                        className="w-full px-5 py-4 rounded-xl bg-ivory border border-accent/15 outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent/30 transition-all text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-accent/70">Subject</label>
                                <input
                                    type="text"
                                    placeholder="What is this about?"
                                    className="w-full px-5 py-4 rounded-xl bg-ivory border border-accent/15 outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent/30 transition-all text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase tracking-widest text-accent/70">Your Message</label>
                                <textarea
                                    rows={6}
                                    placeholder="Write your message here..."
                                    className="w-full px-5 py-4 rounded-xl bg-ivory border border-accent/15 outline-none focus:ring-2 focus:ring-accent/25 focus:border-accent/30 transition-all text-sm resize-none"
                                />
                            </div>
                            <button className="w-full py-4 bg-accent text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-accent-light transition-all shadow-lg shadow-accent/20 text-sm uppercase tracking-wider">
                                Send Message <Send size={16} />
                            </button>
                        </form>
                    </div>

                    {/* Side Info */}
                    <div className="lg:col-span-2 flex flex-col gap-8">
                        {/* FAQ Shortcut */}
                        <div className="bg-primary-dark rounded-3xl p-10 text-white flex-1 relative overflow-hidden">
                            <div className="absolute top-4 right-4 text-6xl font-serif text-accent/10">✦</div>
                            <h3 className="text-xl font-serif font-bold mb-3">Frequently Asked</h3>
                            <p className="text-white/60 text-sm mb-6 leading-relaxed">
                                Before reaching out, check if your question has already been answered in our archive of 25,000+ Q&A entries.
                            </p>
                            <a href="/search" className="inline-flex items-center gap-2 px-6 py-3 bg-accent/20 text-accent rounded-lg font-bold text-sm hover:bg-accent/30 transition-colors border border-accent/30">
                                Search the Archive <Globe size={16} />
                            </a>
                        </div>

                        {/* Contribution */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-10 border border-accent/10">
                            <h3 className="text-xl font-serif font-bold text-primary mb-3">Want to Contribute?</h3>
                            <p className="text-foreground/50 text-sm mb-4 leading-relaxed">
                                Help us improve the archive by volunteering for translation, transcription, or technical development.
                            </p>
                            <a href="mailto:support@tmarchive.com" className="text-accent font-bold text-sm hover:underline">
                                Email us to get involved →
                            </a>
                        </div>

                        {/* Social */}
                        <div className="bg-sand rounded-3xl p-10 border border-accent/10">
                            <h3 className="text-xl font-serif font-bold text-primary mb-3">Follow Us</h3>
                            <p className="text-foreground/50 text-sm mb-4">Stay connected for the latest lectures and archive updates.</p>
                            <div className="flex gap-3">
                                {["YouTube", "Twitter", "Facebook", "Instagram"].map((platform) => (
                                    <span key={platform} className="px-4 py-2 bg-white rounded-lg text-xs font-bold text-primary border border-accent/15 hover:border-accent/40 transition-colors cursor-pointer">
                                        {platform}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
