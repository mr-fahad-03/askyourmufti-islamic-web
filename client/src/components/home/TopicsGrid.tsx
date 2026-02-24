"use client";

import React from "react";
import { motion } from "framer-motion";
import { Book, Heart, Briefcase, Users, Flame, Landmark, GraduationCap } from "lucide-react";
import Link from "next/link";

const TOPICS = [
    { name: "Salah", icon: Book, color: "from-emerald-500/20 to-teal-600/20", border: "border-emerald-500/20", text: "text-emerald-700 dark:text-emerald-400" },
    { name: "Marriage", icon: Heart, color: "from-rose-500/20 to-pink-600/20", border: "border-rose-500/20", text: "text-rose-700 dark:text-rose-400" },
    { name: "Finance", icon: Landmark, color: "from-amber-500/20 to-orange-600/20", border: "border-amber-500/20", text: "text-amber-700 dark:text-amber-400" },
    { name: "Business", icon: Briefcase, color: "from-blue-500/20 to-indigo-600/20", border: "border-blue-500/20", text: "text-blue-700 dark:text-blue-400" },
    { name: "Women", icon: Users, color: "from-purple-500/20 to-violet-600/20", border: "border-purple-500/20", text: "text-purple-700 dark:text-purple-400" },
    { name: "Gambling", icon: Flame, color: "from-red-500/20 to-orange-600/20", border: "border-red-500/20", text: "text-red-700 dark:text-red-400" },
    { name: "Etiquettes", icon: GraduationCap, color: "from-cyan-500/20 to-sky-600/20", border: "border-cyan-500/20", text: "text-cyan-700 dark:text-cyan-400" },
];

export const TopicsGrid = () => {
    return (
        <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
            <div className="flex flex-col items-center text-center mb-16">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-primary font-bold tracking-widest text-xs uppercase mb-3"
                >
                    Explore the Archive
                </motion.span>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-serif font-bold text-zinc-900 dark:text-white"
                >
                    Browse by Topic
                </motion.h2>
                <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    className="h-1 w-24 bg-primary mt-6 rounded-full"
                />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {TOPICS.map((topic, index) => (
                    <motion.div
                        key={topic.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.05 }}
                    >
                        <Link
                            href={`/topics/${topic.name.toLowerCase()}`}
                            className={`group relative flex flex-col items-center justify-center p-8 rounded-3xl border ${topic.border} bg-white dark:bg-zinc-900/50 hover:bg-gradient-to-br ${topic.color} transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-2 overflow-hidden`}
                        >
                            {/* Animated Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 -translate-x-full group-hover:animate-shimmer" />

                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${topic.text} bg-white dark:bg-zinc-800 shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                                <topic.icon size={32} />
                            </div>

                            <h3 className="mt-6 font-bold text-lg text-zinc-800 dark:text-zinc-100 group-hover:text-zinc-900 dark:group-hover:text-white transition-colors">
                                {topic.name}
                            </h3>

                            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                View related Q&As
                            </p>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </section>
    );
};
