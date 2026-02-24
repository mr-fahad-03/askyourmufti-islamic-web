"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/admin/AdminAuthProvider";
import {
    Video,
    MessageSquareQuote,
    Tags,
    Heart,
    Eye,
    TrendingUp,
    Globe,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    BarChart3,
    Activity,
    Calendar,
    Headphones,
    Loader2,
} from "lucide-react";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface SessionItem {
    _id: string;
    title: string;
    sessionNumber: string;
    dateRecorded?: string;
    createdAt: string;
}

interface FAQItem {
    _id: string;
    question: string;
    topic: string;
    sessionNumber: string;
    location?: string;
    createdAt: string;
}

interface TopicItem {
    _id: string;
    name: string;
    createdAt: string;
}

interface DonationItem {
    _id: string;
    bankName: string;
    isActive: boolean;
    updatedAt?: string;
    createdAt: string;
}

type Trend = "up" | "down" | "neutral";

function formatNumber(num: number) {
    return new Intl.NumberFormat("en-US").format(num);
}

function getSinceDaysCount<T extends { createdAt?: string }>(items: T[], days: number) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    return items.filter((item) => item.createdAt && new Date(item.createdAt) >= since).length;
}

function formatRelativeTime(dateString?: string) {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const diffMs = Date.now() - date.getTime();
    const mins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);

    if (mins < 1) return "just now";
    if (mins < 60) return `${mins} min ago`;
    if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
    if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function MiniChart({ trend }: { trend: Trend }) {
    const paths = {
        up: "M0,20 L5,18 L10,15 L15,16 L20,12 L25,14 L30,10 L35,8 L40,5 L45,3 L50,2",
        down: "M0,5 L5,6 L10,8 L15,7 L20,10 L25,12 L30,14 L35,16 L40,18 L45,19 L50,20",
        neutral: "M0,12 L5,11 L10,13 L15,12 L20,11 L25,13 L30,12 L35,11 L40,12 L45,12 L50,12",
    };
    const color = trend === "up" ? "#059669" : trend === "down" ? "#DC2626" : "#9CA3AF";
    return (
        <svg width="50" height="22" viewBox="0 0 50 22" className="opacity-60">
            <path d={paths[trend]} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

export default function AdminDashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [sessions, setSessions] = useState<SessionItem[]>([]);
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [topics, setTopics] = useState<TopicItem[]>([]);
    const [donations, setDonations] = useState<DonationItem[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [sRes, qRes, tRes, dRes] = await Promise.all([
                    fetch(`${API_URL}/sessions`),
                    fetch(`${API_URL}/qa`),
                    fetch(`${API_URL}/topics`),
                    fetch(`${API_URL}/donations/all`),
                ]);

                const [sData, qData, tData, dData] = await Promise.all([
                    sRes.json(),
                    qRes.json(),
                    tRes.json(),
                    dRes.json(),
                ]);

                setSessions(Array.isArray(sData) ? sData : []);
                setFaqs(Array.isArray(qData) ? qData : []);
                setTopics(Array.isArray(tData) ? tData : []);
                setDonations(Array.isArray(dData) ? dData : []);
            } catch (error) {
                console.error("Failed to load dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const greeting = (() => {
        const h = new Date().getHours();
        if (h < 12) return "Good Morning";
        if (h < 17) return "Good Afternoon";
        return "Good Evening";
    })();

    const stats = useMemo(() => {
        const sessions7d = getSinceDaysCount(sessions, 7);
        const faqs7d = getSinceDaysCount(faqs, 7);
        const topics7d = getSinceDaysCount(topics, 7);
        const donations7d = getSinceDaysCount(donations, 7);

        return [
            {
                label: "Total Sessions",
                value: formatNumber(sessions.length),
                change: `+${sessions7d}`,
                trend: sessions7d > 0 ? "up" as Trend : "neutral" as Trend,
                icon: Video,
                color: "text-primary",
                bg: "bg-primary/10",
                href: "/islamic-admin/sessions",
            },
            {
                label: "Questions & Answers",
                value: formatNumber(faqs.length),
                change: `+${faqs7d}`,
                trend: faqs7d > 0 ? "up" as Trend : "neutral" as Trend,
                icon: MessageSquareQuote,
                color: "text-accent",
                bg: "bg-accent/10",
                href: "/islamic-admin/qa",
            },
            {
                label: "Topics",
                value: formatNumber(topics.length),
                change: `+${topics7d}`,
                trend: topics7d > 0 ? "up" as Trend : "neutral" as Trend,
                icon: Tags,
                color: "text-violet-600",
                bg: "bg-violet-100",
                href: "/islamic-admin/topics",
            },
            {
                label: "Donation Accounts",
                value: formatNumber(donations.length),
                change: `+${donations7d}`,
                trend: donations7d > 0 ? "up" as Trend : "neutral" as Trend,
                icon: Heart,
                color: "text-rose-600",
                bg: "bg-rose-100",
                href: "/islamic-admin/donations",
            },
        ];
    }, [sessions, faqs, topics, donations]);

    const locations = useMemo(
        () =>
            faqs
                .map((f) => (f.location || "").trim())
                .filter(Boolean)
                .map((loc) => {
                    const parts = loc.split(",").map((p) => p.trim()).filter(Boolean);
                    return parts.length ? parts[parts.length - 1] : loc;
                }),
        [faqs]
    );

    const countriesData = useMemo(() => {
        const map = new Map<string, number>();
        locations.forEach((country) => {
            map.set(country, (map.get(country) || 0) + 1);
        });
        const total = [...map.values()].reduce((sum, c) => sum + c, 0) || 1;
        return [...map.entries()]
            .sort((a, b) => b[1] - a[1])
            .slice(0, 6)
            .map(([country, count]) => ({
                country,
                visitors: formatNumber(count),
                pct: Math.max(4, Math.round((count / total) * 100)),
            }));
    }, [locations]);

    const topSessions = useMemo(
        () =>
            [...sessions]
                .sort((a, b) => Number(b.sessionNumber || 0) - Number(a.sessionNumber || 0))
                .slice(0, 5)
                .map((s) => ({
                    number: s.sessionNumber,
                    title: s.title,
                    date: s.dateRecorded || s.createdAt,
                })),
        [sessions]
    );

    const topQuestions = useMemo(() => [...faqs].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)).slice(0, 5), [faqs]);

    const activeDonationCount = useMemo(() => donations.filter((d) => d.isActive).length, [donations]);
    const avgFaqPerSession = useMemo(() => (sessions.length ? (faqs.length / sessions.length).toFixed(1) : "0.0"), [faqs.length, sessions.length]);
    const totalContentItems = sessions.length + faqs.length + topics.length;

    const overviewStats = useMemo(
        () => [
            { label: "Total Content Items", value: formatNumber(totalContentItems), icon: Eye, change: `+${getSinceDaysCount([...sessions, ...faqs, ...topics], 7)}`, trend: "up" as Trend },
            { label: "Active Donation Accounts", value: formatNumber(activeDonationCount), icon: Heart, change: `${activeDonationCount}/${donations.length}`, trend: "neutral" as Trend },
            { label: "Avg Questions per Session", value: avgFaqPerSession, icon: Clock, change: `${faqs.length} / ${sessions.length || 1}`, trend: "neutral" as Trend },
            { label: "Countries Covered", value: formatNumber(countriesData.length), icon: Globe, change: `${locations.length} entries`, trend: countriesData.length > 0 ? "up" as Trend : "neutral" as Trend },
        ],
        [totalContentItems, sessions, faqs, topics, activeDonationCount, donations.length, avgFaqPerSession, countriesData.length, locations.length]
    );

    const activity = useMemo(() => {
        const entries: Array<{ action: string; time: string; icon: any; color: string; ts: number }> = [];
        sessions.forEach((s) => entries.push({ action: `Session #${s.sessionNumber} created`, time: formatRelativeTime(s.createdAt), icon: Video, color: "text-primary", ts: +new Date(s.createdAt) }));
        faqs.forEach((q) => entries.push({ action: `Q&A added: ${q.question}`, time: formatRelativeTime(q.createdAt), icon: MessageSquareQuote, color: "text-accent", ts: +new Date(q.createdAt) }));
        topics.forEach((t) => entries.push({ action: `Topic created: ${t.name}`, time: formatRelativeTime(t.createdAt), icon: Tags, color: "text-violet-600", ts: +new Date(t.createdAt) }));
        donations.forEach((d) => entries.push({ action: `Donation account updated: ${d.bankName}`, time: formatRelativeTime(d.updatedAt || d.createdAt), icon: Heart, color: "text-rose-600", ts: +new Date(d.updatedAt || d.createdAt) }));
        return entries.sort((a, b) => b.ts - a.ts).slice(0, 8);
    }, [sessions, faqs, topics, donations]);

    const chartBars = useMemo(() => {
        const days = 28;
        const counts: number[] = new Array(days).fill(0);
        const now = new Date();
        const start = new Date(now);
        start.setDate(now.getDate() - (days - 1));
        faqs.forEach((q) => {
            const created = new Date(q.createdAt);
            const diffDays = Math.floor((created.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && diffDays < days) counts[diffDays] += 1;
        });
        const max = Math.max(...counts, 1);
        return counts.map((c) => Math.max(8, Math.round((c / max) * 100)));
    }, [faqs]);

    return (
        <div className="flex flex-col gap-8 max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-zinc-900">
                        {greeting}, {user?.name?.split(" ")[0] || "Admin"}
                    </h1>
                    <p className="text-zinc-500 mt-1">
                        Here&apos;s what&apos;s happening with your archive today.
                    </p>
                </div>
                <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-500">
                    <Calendar size={14} />
                    {new Date().toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric", year: "numeric" })}
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 size={28} className="animate-spin text-primary" />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {stats.map((stat) => (
                            <Link
                                key={stat.label}
                                href={stat.href}
                                className="bg-white border border-zinc-200 rounded-2xl p-5 hover:border-primary/30 hover:shadow-md transition-all group"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${stat.bg}`}>
                                        <stat.icon size={20} className={stat.color} />
                                    </div>
                                    <MiniChart trend={stat.trend} />
                                </div>
                                <p className="text-2xl font-bold text-zinc-900">{stat.value}</p>
                                <div className="flex items-center justify-between mt-1">
                                    <p className="text-xs text-zinc-500 font-medium">{stat.label}</p>
                                    {stat.trend !== "neutral" && (
                                        <span className={`inline-flex items-center gap-0.5 text-xs font-bold ${stat.trend === "up" ? "text-emerald-600" : "text-red-500"}`}>
                                            {stat.trend === "up" ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                            {stat.change}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
                        <div className="p-6 border-b border-zinc-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                                    <BarChart3 size={18} className="text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-zinc-900">Live Overview</h2>
                                    <p className="text-xs text-zinc-500">Computed from current database</p>
                                </div>
                            </div>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                                Live data
                            </span>
                        </div>
                        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-zinc-100">
                            {overviewStats.map((ts) => (
                                <div key={ts.label} className="p-6 flex flex-col gap-2">
                                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
                                        <ts.icon size={13} />
                                        {ts.label}
                                    </div>
                                    <p className="text-2xl font-bold text-zinc-900">{ts.value}</p>
                                    <span className={`text-xs font-bold ${ts.trend === "up" ? "text-emerald-600" : ts.trend === "down" ? "text-red-500" : "text-zinc-400"}`}>
                                        {ts.change}
                                    </span>
                                </div>
                            ))}
                        </div>

                        <div className="px-6 pb-6 pt-2">
                            <div className="flex items-end gap-1.5 h-32">
                                {chartBars.map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 rounded-t-sm bg-primary/20 hover:bg-primary/40 transition-colors relative group cursor-pointer"
                                        style={{ height: `${h}%` }}
                                    >
                                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                            Day {i + 1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
                            <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <Headphones size={18} className="text-primary" />
                                    <h3 className="font-bold text-zinc-900">Latest Sessions</h3>
                                </div>
                                <Link href="/islamic-admin/sessions" className="text-xs text-primary font-bold hover:underline">
                                    View All
                                </Link>
                            </div>
                            <div className="divide-y divide-zinc-100">
                                {topSessions.length === 0 ? (
                                    <p className="text-sm text-zinc-500 p-4">No sessions found.</p>
                                ) : (
                                    topSessions.map((session, i) => (
                                        <div key={session.number + i} className="flex items-center gap-4 p-4 hover:bg-zinc-50 transition-colors">
                                            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
                                                #{i + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-zinc-900 truncate">
                                                    Session #{session.number}: {session.title}
                                                </p>
                                                <p className="text-xs text-zinc-400 mt-0.5">{formatRelativeTime(session.date)}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
                            <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <TrendingUp size={18} className="text-accent" />
                                    <h3 className="font-bold text-zinc-900">Latest Questions</h3>
                                </div>
                                <Link href="/islamic-admin/qa" className="text-xs text-primary font-bold hover:underline">
                                    View All
                                </Link>
                            </div>
                            <div className="divide-y divide-zinc-100">
                                {topQuestions.length === 0 ? (
                                    <p className="text-sm text-zinc-500 p-4">No questions found.</p>
                                ) : (
                                    topQuestions.map((q, i) => (
                                        <div key={q._id} className="flex items-center gap-4 p-4 hover:bg-zinc-50 transition-colors">
                                            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-xs font-bold text-accent flex-shrink-0">
                                                #{i + 1}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-zinc-900 truncate">{q.question}</p>
                                                <span className="inline-block mt-1 px-2 py-0.5 bg-zinc-100 rounded-full text-[10px] font-bold text-zinc-500 uppercase tracking-wide">
                                                    {q.topic || "General"}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
                            <div className="p-5 border-b border-zinc-200 flex items-center gap-3">
                                <Globe size={18} className="text-primary" />
                                <h3 className="font-bold text-zinc-900">Top Countries</h3>
                            </div>
                            <div className="p-5 flex flex-col gap-4">
                                {countriesData.length === 0 ? (
                                    <p className="text-sm text-zinc-500">No location data found in Q&A yet.</p>
                                ) : (
                                    countriesData.map((c) => (
                                        <div key={c.country} className="flex items-center gap-4">
                                            <span className="text-sm font-medium text-zinc-700 w-28 truncate">{c.country}</span>
                                            <div className="flex-1 bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                                                <div className="h-full bg-primary/60 rounded-full transition-all" style={{ width: `${c.pct}%` }} />
                                            </div>
                                            <div className="flex items-center gap-2 flex-shrink-0">
                                                <span className="text-xs font-bold text-zinc-500 w-12 text-right">{c.visitors}</span>
                                                <span className="text-[10px] text-zinc-400 w-8 text-right">{c.pct}%</span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
                            <div className="p-5 border-b border-zinc-200 flex items-center gap-3">
                                <Activity size={18} className="text-primary" />
                                <h3 className="font-bold text-zinc-900">Recent Activity</h3>
                            </div>
                            <div className="divide-y divide-zinc-100">
                                {activity.length === 0 ? (
                                    <p className="text-sm text-zinc-500 p-4">No recent activity found.</p>
                                ) : (
                                    activity.map((a, i) => (
                                        <div key={i} className="flex items-center gap-4 p-4">
                                            <div className="w-9 h-9 rounded-xl bg-zinc-100 flex items-center justify-center flex-shrink-0">
                                                <a.icon size={16} className={a.color} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-zinc-800 truncate">{a.action}</p>
                                                <p className="text-xs text-zinc-400 mt-0.5">{a.time}</p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-zinc-200 rounded-2xl p-6">
                        <h3 className="font-bold text-zinc-900 mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {[
                                { label: "Add Session", icon: Video, href: "/islamic-admin/sessions", color: "text-primary", bg: "bg-primary/10" },
                                { label: "Add Q&A", icon: MessageSquareQuote, href: "/islamic-admin/qa", color: "text-accent", bg: "bg-accent/10" },
                                { label: "Add Topic", icon: Tags, href: "/islamic-admin/topics", color: "text-violet-600", bg: "bg-violet-100" },
                                { label: "Manage Donations", icon: Heart, href: "/islamic-admin/donations", color: "text-rose-600", bg: "bg-rose-100" },
                            ].map((action) => (
                                <Link
                                    key={action.label}
                                    href={action.href}
                                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-zinc-200 hover:border-primary/30 hover:bg-zinc-50 transition-all group"
                                >
                                    <div className={`w-9 h-9 rounded-lg ${action.bg} flex items-center justify-center`}>
                                        <action.icon size={16} className={action.color} />
                                    </div>
                                    <span className="text-sm font-semibold text-zinc-700 group-hover:text-zinc-900 transition-colors">
                                        {action.label}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
