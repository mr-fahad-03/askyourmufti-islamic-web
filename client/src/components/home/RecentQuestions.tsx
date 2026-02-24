"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageSquare, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const QUESTIONS = [
    { id: 1, q: "What is the ruling on using interest-based bank accounts for business?", topic: "Finance" },
    { id: 2, q: "Is it permissible to perform Umrah on behalf of deceased parents?", topic: "Worship" },
    { id: 3, q: "How to handle minor disagreements in a marriage according to Sunnah?", topic: "Marriage" },
    { id: 4, q: "What are the rules regarding Zakat on property investments?", topic: "Finance" },
];

export const RecentQuestions = () => {
    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="text-primary font-bold tracking-widest text-xs uppercase mb-3 inline-block"
                    >
                        Digital Archive
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 dark:text-white mb-6"
                    >
                        Recent Answers from Mufti Tariq Masood
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-zinc-600 dark:text-zinc-400 text-lg mb-8"
                    >
                        Access a vast library of structured knowledge, categorized for your ease of understanding. Every answer is linked to its original session recording.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <Link href="/search" className="inline-flex items-center gap-2 px-8 py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-full font-bold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors shadow-lg shadow-zinc-900/10">
                            Explore All Questions
                        </Link>
                    </motion.div>
                </div>

                <div className="flex flex-col gap-4">
                    {QUESTIONS.map((item, index) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className="group p-6 bg-white dark:bg-zinc-900/50 rounded-3xl border border-zinc-200 dark:border-zinc-800 hover:border-primary/50 hover:shadow-xl transition-all duration-300"
                        >
                            <Link href={`/qa/${item.id}`} className="flex items-start justify-between gap-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-2xl bg-zinc-50 dark:bg-zinc-800 flex flex-shrink-0 items-center justify-center text-zinc-400 group-hover:text-primary transition-colors">
                                        <MessageSquare size={18} />
                                    </div>
                                    <div>
                                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1 block">
                                            {item.topic}
                                        </span>
                                        <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 group-hover:text-zinc-900 dark:group-hover:text-white leading-snug">
                                            {item.q}
                                        </h3>
                                    </div>
                                </div>
                                <ArrowUpRight size={20} className="text-zinc-300 group-hover:text-primary transition-colors flex-shrink-0" />
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
