"use client";

import React from "react";
import { motion } from "framer-motion";
import { PlayCircle, Clock, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

const MOCK_SESSIONS = [
    {
        id: 1,
        title: "Understanding Riba in Modern Banking",
        date: "Feb 15, 2024",
        duration: "45 min",
        category: "Finance",
        image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 2,
        title: "The Rights of Parents in Islam",
        date: "Feb 10, 2024",
        duration: "52 min",
        category: "Ethics",
        image: "https://images.unsplash.com/photo-1590076247291-a20c9047970d?auto=format&fit=crop&q=80&w=800"
    },
    {
        id: 3,
        title: "Fiqh of Salah - Practical Guide",
        date: "Feb 05, 2024",
        duration: "38 min",
        category: "Worship",
        image: "https://images.unsplash.com/photo-1584551271411-fe927438174a?auto=format&fit=crop&q=80&w=800"
    },
];

export const FeaturedSessions = () => {
    return (
        <section className="py-24 bg-zinc-50 dark:bg-zinc-950/50">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-xl">
                        <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-primary font-bold tracking-widest text-xs uppercase mb-3 inline-block"
                        >
                            Recent Lectures
                        </motion.span>
                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 dark:text-white"
                        >
                            Latest Knowledge Sessions
                        </motion.h2>
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link
                            href="/sessions"
                            className="group flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
                        >
                            Explore All Sessions <ArrowRight size={18} />
                        </Link>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_SESSIONS.map((session, index) => (
                        <motion.div
                            key={session.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group bg-white dark:bg-zinc-900 rounded-[2rem] overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-2xl transition-all duration-500"
                        >
                            <div className="relative aspect-video overflow-hidden">
                                <img
                                    src={session.image}
                                    alt={session.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <PlayCircle className="text-white w-16 h-16 transform scale-90 group-hover:scale-100 transition-transform duration-500" />
                                </div>
                                <div className="absolute top-4 left-4">
                                    <span className="px-4 py-1.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-full text-xs font-bold text-primary shadow-lg uppercase tracking-wider">
                                        {session.category}
                                    </span>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-500 mb-4 font-medium">
                                    <span className="flex items-center gap-1.5"><Calendar size={14} /> {session.date}</span>
                                    <span className="flex items-center gap-1.5"><Clock size={14} /> {session.duration}</span>
                                </div>

                                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-4 line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                                    {session.title}
                                </h3>

                                <Link
                                    href={`/sessions/${session.id}`}
                                    className="inline-flex items-center text-sm font-bold text-zinc-900 dark:text-white gap-2 group/btn"
                                >
                                    View Lecture
                                    <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover/btn:bg-primary group-hover/btn:text-white transition-colors">
                                        <ArrowRight size={14} />
                                    </div>
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
