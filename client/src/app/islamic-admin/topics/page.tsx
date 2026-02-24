"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Tags, Plus, Edit2, Trash2, X, Save, Loader2 } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Topic {
    _id: string;
    name: string;
    slug: string;
    description?: string;
    subtopics?: string[];
    seoTitle?: string;
    seoDescription?: string;
}

interface TopicCount {
    _id: string;
    count: number;
}

const emptyForm = {
    name: "",
    slug: "",
    description: "",
    subtopicsText: "",
    seoTitle: "",
    seoDescription: "",
};

function slugify(text: string) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

export default function TopicsManagerPage() {
    const [topics, setTopics] = useState<Topic[]>([]);
    const [topicCounts, setTopicCounts] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [error, setError] = useState("");
    const [form, setForm] = useState(emptyForm);

    const showForm = isAdding || editingId;

    const fetchTopics = async () => {
        try {
            setLoading(true);
            const [topicsRes, countsRes] = await Promise.all([
                fetch(`${API_URL}/topics`),
                fetch(`${API_URL}/qa/topics-list`),
            ]);

            const topicsData = await topicsRes.json();
            const countsData = await countsRes.json();

            setTopics(Array.isArray(topicsData) ? topicsData : []);

            const countMap: Record<string, number> = {};
            if (Array.isArray(countsData)) {
                (countsData as TopicCount[]).forEach((item) => {
                    countMap[item._id.toLowerCase()] = item.count;
                });
            }
            setTopicCounts(countMap);
        } catch (err) {
            console.error("Failed to fetch topics", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTopics();
    }, []);

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setIsAdding(false);
        setError("");
    };

    const startAdding = () => {
        setEditingId(null);
        setForm(emptyForm);
        setIsAdding(true);
        setError("");
    };

    const handleEdit = (topic: Topic) => {
        setEditingId(topic._id);
        setIsAdding(false);
        setError("");
        setForm({
            name: topic.name || "",
            slug: topic.slug || "",
            description: topic.description || "",
            subtopicsText: (topic.subtopics || []).join(", "),
            seoTitle: topic.seoTitle || "",
            seoDescription: topic.seoDescription || "",
        });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => {
            const next = { ...prev, [name]: value };
            if (name === "name" && !editingId) {
                next.slug = slugify(value);
            }
            return next;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError("");
        try {
            const payload = {
                name: form.name.trim(),
                slug: form.slug.trim(),
                description: form.description.trim(),
                subtopics: form.subtopicsText
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                seoTitle: form.seoTitle.trim(),
                seoDescription: form.seoDescription.trim(),
            };

            const url = editingId ? `${API_URL}/topics/${editingId}` : `${API_URL}/topics`;
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({ message: "Request failed" }));
                throw new Error(data.message || "Failed to save topic");
            }

            await fetchTopics();
            resetForm();
        } catch (err: any) {
            setError(err.message || "Failed to save topic");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/topics/${id}`, { method: "DELETE" });
            if (res.ok) {
                await fetchTopics();
                if (editingId === id) resetForm();
            }
        } catch (err) {
            console.error("Failed to delete topic", err);
        } finally {
            setDeleteConfirm(null);
        }
    };

    const topicCountLabel = useMemo(() => `${topics.length} topic${topics.length === 1 ? "" : "s"}`, [topics.length]);

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-zinc-900">Topic Manager</h1>
                    <p className="text-zinc-500 mt-1">Create and manage dynamic topic pages ({topicCountLabel}).</p>
                </div>
                <button
                    onClick={showForm ? resetForm : startAdding}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors shadow-sm"
                >
                    {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Topic</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-zinc-900 mb-2">Existing Topics ({topics.length})</h2>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={24} className="animate-spin text-primary" />
                        </div>
                    ) : topics.length === 0 ? (
                        <div className="text-center py-12 bg-white border border-zinc-200 rounded-xl text-zinc-500 text-sm">
                            No topics yet. Add one to get started.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {topics.map((topic) => {
                                const questionCount = topicCounts[topic.name.toLowerCase()] || 0;
                                const subtopicCount = topic.subtopics?.length || 0;
                                const isActive = editingId === topic._id;

                                return (
                                    <div
                                        key={topic._id}
                                        className={`bg-white border p-4 rounded-xl cursor-pointer transition-all ${
                                            isActive ? "border-primary ring-2 ring-primary/20" : "border-zinc-200 hover:border-primary/50"
                                        }`}
                                        onClick={() => handleEdit(topic)}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-zinc-900 truncate">{topic.name}</h3>
                                                <p className="text-xs text-zinc-500 mt-1 font-mono truncate">/{topic.slug}</p>
                                                <div className="flex gap-3 text-xs text-zinc-500 mt-2 font-medium">
                                                    <span>{subtopicCount} Subtopics</span>
                                                    <span>{questionCount} Q&As</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleEdit(topic); }}
                                                    className="text-zinc-400 hover:text-primary transition-colors p-1"
                                                >
                                                    <Edit2 size={15} />
                                                </button>
                                                {deleteConfirm === topic._id ? (
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDelete(topic._id); }}
                                                            className="text-xs text-red-600 font-bold hover:underline px-1"
                                                        >
                                                            Yes
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setDeleteConfirm(null); }}
                                                            className="text-xs text-zinc-400 hover:underline px-1"
                                                        >
                                                            No
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(topic._id); }}
                                                        className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                <div className="lg:col-span-2">
                    {showForm ? (
                        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-zinc-200 bg-zinc-50 flex gap-3 items-center">
                                <Tags size={20} className="text-primary" />
                                <h2 className="text-lg font-bold text-zinc-900">
                                    {editingId ? `Edit Topic: ${form.name || "..."}` : "Create New Topic"}
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                                {error && (
                                    <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
                                        {error}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-zinc-700">Topic Name *</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                            className="px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="e.g. Finance"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-zinc-700">URL Slug *</label>
                                        <input
                                            type="text"
                                            name="slug"
                                            value={form.slug}
                                            onChange={handleChange}
                                            required
                                            className="px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none font-mono"
                                            placeholder="e.g. finance"
                                        />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-zinc-700">Hub Overview (Description)</label>
                                    <textarea
                                        rows={4}
                                        name="description"
                                        value={form.description}
                                        onChange={handleChange}
                                        className="px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none resize-y"
                                        placeholder="Description shown at the top of the topic page."
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-zinc-700">Subtopics (comma-separated)</label>
                                    <input
                                        type="text"
                                        name="subtopicsText"
                                        value={form.subtopicsText}
                                        onChange={handleChange}
                                        className="px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                        placeholder="Nikah, Talaq, Khula"
                                    />
                                </div>

                                <hr className="border-zinc-200" />

                                <h3 className="font-bold text-zinc-900 -mb-2">SEO Configuration for Hub</h3>

                                <div className="flex flex-col gap-4">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-zinc-700">Meta Title</label>
                                        <input
                                            type="text"
                                            name="seoTitle"
                                            value={form.seoTitle}
                                            onChange={handleChange}
                                            className="px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="SEO title for topic hub"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-zinc-700">Meta Description</label>
                                        <textarea
                                            rows={2}
                                            name="seoDescription"
                                            value={form.seoDescription}
                                            onChange={handleChange}
                                            className="px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none resize-y"
                                            placeholder="SEO description for topic hub"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-4 mt-2 border-t border-zinc-200">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-light transition-colors shadow-lg disabled:opacity-50"
                                    >
                                        <Save size={16} />
                                        {saving ? "Saving..." : editingId ? "Update Topic" : "Save Topic"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center py-20">
                            <Tags size={48} className="text-zinc-200 mb-4" />
                            <h3 className="text-lg font-bold text-zinc-400">Select or Add a Topic</h3>
                            <p className="text-sm text-zinc-400 mt-1">Click a topic to edit, or add a new one.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
