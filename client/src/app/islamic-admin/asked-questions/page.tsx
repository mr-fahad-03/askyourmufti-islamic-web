"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Loader2, Mail, MessageSquare, Search, UserRound } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface AskedQuestion {
    _id: string;
    fullName: string;
    email: string;
    category: string;
    preferredLanguage: string;
    question: string;
    status: "new" | "reviewed";
    createdAt: string;
}

function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function AskedQuestionsPage() {
    const [questions, setQuestions] = useState<AskedQuestion[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                setLoading(true);
                const res = await fetch(`${API_URL}/asked-questions`);
                const data = await res.json();
                setQuestions(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error("Failed to load asked questions", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    const filteredQuestions = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        if (!q) return questions;

        return questions.filter((item) =>
            item.fullName.toLowerCase().includes(q)
            || item.email.toLowerCase().includes(q)
            || item.question.toLowerCase().includes(q)
            || item.category.toLowerCase().includes(q)
        );
    }, [questions, searchQuery]);

    return (
        <div className="max-w-6xl mx-auto flex flex-col gap-6">
            <div>
                <h1 className="text-3xl font-serif font-bold text-zinc-900">Asked Questions</h1>
                <p className="text-zinc-500 mt-1">Questions submitted from the public ask form.</p>
            </div>

            <div className="relative max-w-md">
                <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input
                    type="text"
                    placeholder="Search by name, email, category, question..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-sm focus:ring-2 focus:ring-primary/40 outline-none"
                />
            </div>

            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
                {loading ? (
                    <div className="py-16 flex items-center justify-center">
                        <Loader2 size={24} className="animate-spin text-primary" />
                    </div>
                ) : filteredQuestions.length === 0 ? (
                    <div className="py-16 text-center text-zinc-500 text-sm">
                        {questions.length === 0 ? "No asked questions submitted yet." : "No matching questions found."}
                    </div>
                ) : (
                    <div className="divide-y divide-zinc-100">
                        {filteredQuestions.map((item) => (
                            <div key={item._id} className="p-5 md:p-6">
                                <div className="flex flex-wrap items-center gap-3 mb-3">
                                    <span className="inline-flex items-center gap-1.5 text-sm text-zinc-700 font-semibold">
                                        <UserRound size={14} className="text-primary" />
                                        {item.fullName}
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500">
                                        <Mail size={14} />
                                        {item.email}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-lg bg-accent/10 text-accent text-xs font-bold">
                                        {item.category}
                                    </span>
                                    <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-600 text-xs font-semibold uppercase">
                                        {item.preferredLanguage || "en"}
                                    </span>
                                    <span className="text-xs text-zinc-400 ml-auto">{formatDate(item.createdAt)}</span>
                                </div>

                                <div className="flex items-start gap-2 text-zinc-700">
                                    <MessageSquare size={15} className="text-primary mt-1 flex-shrink-0" />
                                    <p className="leading-relaxed text-sm md:text-base">{item.question}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
