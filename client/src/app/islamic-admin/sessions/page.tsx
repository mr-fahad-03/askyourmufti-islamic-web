"use client";

import React, { useState, useEffect } from "react";
import {
    Video,
    Plus,
    Edit2,
    Trash2,
    X,
    Save,
    Calendar,
    Hash,
    Link2,
    FileText,
    Headphones,
    Play,
    Search,
    Loader2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface Session {
    _id: string;
    title: string;
    sessionNumber: string;
    dateRecorded: string;
    description: string;
    audioUrl: string;
    videoUrl: string;
    translations?: {
        ur?: { title?: string; description?: string };
        de?: { title?: string; description?: string };
        fr?: { title?: string; description?: string };
        es?: { title?: string; description?: string };
    };
    createdAt: string;
    updatedAt: string;
}

const emptyForm = {
    title: "",
    sessionNumber: "",
    dateRecorded: "",
    description: "",
    videoUrl: "",
    translations: {
        ur: { title: "", description: "" },
        de: { title: "", description: "" },
        fr: { title: "", description: "" },
        es: { title: "", description: "" },
    },
};

export default function SessionsManagerPage() {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [activeLang, setActiveLang] = useState<"en" | "ur" | "de" | "fr" | "es">("en");
    const [form, setForm] = useState(emptyForm);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const fetchSessions = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/sessions`);
            const data = await res.json();
            setSessions(data);
        } catch (err) {
            console.error("Failed to fetch sessions", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessions();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value } as typeof prev));
    };

    const handleTranslationChange = (
        lang: "ur" | "de" | "fr" | "es",
        field: "title" | "description",
        value: string
    ) => {
        setForm((prev) => ({
            ...prev,
            translations: {
                ...prev.translations,
                [lang]: {
                    ...prev.translations[lang],
                    [field]: value,
                },
            },
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editingId ? `${API_URL}/sessions/${editingId}` : `${API_URL}/sessions`;
            const method = editingId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                await fetchSessions();
                resetForm();
            }
        } catch (err) {
            console.error("Failed to save session", err);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (session: Session) => {
        setEditingId(session._id);
        setIsAdding(false);
        setActiveLang("en");
        setForm({
            title: session.title,
            sessionNumber: session.sessionNumber,
            dateRecorded: session.dateRecorded ? session.dateRecorded.split("T")[0] : "",
            description: session.description || "",
            videoUrl: session.videoUrl || "",
            translations: {
                ur: {
                    title: session.translations?.ur?.title || "",
                    description: session.translations?.ur?.description || "",
                },
                de: {
                    title: session.translations?.de?.title || "",
                    description: session.translations?.de?.description || "",
                },
                fr: {
                    title: session.translations?.fr?.title || "",
                    description: session.translations?.fr?.description || "",
                },
                es: {
                    title: session.translations?.es?.title || "",
                    description: session.translations?.es?.description || "",
                },
            },
        });
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/sessions/${id}`, { method: "DELETE" });
            if (res.ok) {
                await fetchSessions();
                if (editingId === id) resetForm();
            }
        } catch (err) {
            console.error("Failed to delete", err);
        }
        setDeleteConfirm(null);
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setIsAdding(false);
        setActiveLang("en");
    };

    const startAdding = () => {
        setEditingId(null);
        setActiveLang("en");
        setForm(emptyForm);
        setIsAdding(true);
    };

    const showForm = isAdding || editingId;

    const filteredSessions = sessions.filter(
        (s) =>
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.sessionNumber.includes(searchQuery)
    );

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-zinc-900">Session Manager</h1>
                    <p className="text-zinc-500 mt-1">
                        Manage and organize all recorded sessions ({sessions.length} total).
                    </p>
                </div>
                <button
                    onClick={showForm ? resetForm : startAdding}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors shadow-sm"
                >
                    {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Session</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Session List */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    {/* Search */}
                    <div className="relative">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input
                            type="text"
                            placeholder="Search sessions..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                        />
                    </div>

                    <h2 className="text-lg font-bold text-zinc-900">
                        Sessions ({filteredSessions.length})
                    </h2>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 size={24} className="animate-spin text-primary" />
                        </div>
                    ) : filteredSessions.length === 0 ? (
                        <div className="text-center py-12 bg-white border border-zinc-200 rounded-xl">
                            <Video size={40} className="mx-auto text-zinc-300 mb-3" />
                            <p className="text-zinc-500 text-sm">
                                {sessions.length === 0 ? "No sessions yet. Add one!" : "No matching sessions."}
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3 max-h-[65vh] overflow-y-auto pr-1">
                            {filteredSessions.map((session) => (
                                <div
                                    key={session._id}
                                    className={`bg-white border p-4 rounded-xl cursor-pointer transition-all ${
                                        editingId === session._id
                                            ? "border-primary ring-2 ring-primary/20"
                                            : "border-zinc-200 hover:border-primary/50"
                                    }`}
                                    onClick={() => handleEdit(session)}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Headphones size={16} className="text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                                                    #{session.sessionNumber}
                                                </span>
                                            </div>
                                            <h3 className="font-semibold text-sm text-zinc-900 truncate">
                                                {session.title}
                                            </h3>
                                            {session.dateRecorded && (
                                                <p className="text-xs text-zinc-400 mt-1">
                                                    {new Date(session.dateRecorded).toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-zinc-100">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEdit(session); }}
                                            className="text-zinc-400 hover:text-primary transition-colors p-1"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                        {session.videoUrl && (
                                            <a
                                                href={session.videoUrl}
                                                target="_blank"
                                                rel="noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="text-zinc-400 hover:text-primary transition-colors p-1"
                                                title="Watch"
                                            >
                                                <Play size={14} />
                                            </a>
                                        )}
                                        {deleteConfirm === session._id ? (
                                            <div className="flex items-center gap-1 ml-auto">
                                                <span className="text-xs text-red-500 font-medium">Delete?</span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(session._id); }}
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
                                                onClick={(e) => { e.stopPropagation(); setDeleteConfirm(session._id); }}
                                                className="text-zinc-400 hover:text-red-500 transition-colors p-1 ml-auto"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right: Form */}
                <div className="lg:col-span-2">
                    {showForm ? (
                        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                            <div className="p-6 border-b border-zinc-200 bg-zinc-50 flex gap-3 items-center">
                                <Video size={20} className="text-primary" />
                                <h2 className="text-lg font-bold text-zinc-900">
                                    {editingId ? "Edit Session" : "Add New Session"}
                                </h2>
                                <div className="ml-auto flex items-center gap-2">
                                    {([
                                        { code: "en", label: "EN" },
                                        { code: "ur", label: "UR" },
                                        { code: "de", label: "DE" },
                                        { code: "fr", label: "FR" },
                                        { code: "es", label: "ES" },
                                    ] as const).map((lang) => (
                                        <button
                                            key={lang.code}
                                            type="button"
                                            onClick={() => setActiveLang(lang.code)}
                                            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                                                activeLang === lang.code
                                                    ? "bg-primary text-white border-primary"
                                                    : "bg-white text-zinc-600 border-zinc-300 hover:border-primary/40 hover:text-primary"
                                            }`}
                                        >
                                            {lang.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                                {/* Session Number */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                                            <Hash size={13} /> Session # *
                                        </label>
                                        <input
                                            type="text"
                                            name="sessionNumber"
                                            value={form.sessionNumber}
                                            onChange={handleChange}
                                            required
                                            className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none font-mono"
                                            placeholder="523"
                                        />
                                    </div>
                                </div>

                                {/* Language specific fields */}
                                {activeLang === "en" ? (
                                    <>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                                                <FileText size={13} /> Session Title (EN) *
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={form.title}
                                                onChange={handleChange}
                                                required
                                                className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                                placeholder="e.g. Riba & Modern Banking in Islam"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                                                <FileText size={13} /> Description (EN)
                                            </label>
                                            <textarea
                                                name="description"
                                                value={form.description}
                                                onChange={handleChange}
                                                rows={4}
                                                className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none resize-y"
                                                placeholder="Brief description of the session content..."
                                            />
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                                                <FileText size={13} /> Session Title ({activeLang.toUpperCase()})
                                            </label>
                                            <input
                                                type="text"
                                                value={form.translations[activeLang].title}
                                                onChange={(e) => handleTranslationChange(activeLang, "title", e.target.value)}
                                                className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                                placeholder={`Translated title in ${activeLang.toUpperCase()}`}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                                                <FileText size={13} /> Description ({activeLang.toUpperCase()})
                                            </label>
                                            <textarea
                                                rows={4}
                                                value={form.translations[activeLang].description}
                                                onChange={(e) => handleTranslationChange(activeLang, "description", e.target.value)}
                                                className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none resize-y"
                                                placeholder={`Translated description in ${activeLang.toUpperCase()}`}
                                            />
                                        </div>
                                    </>
                                )}

                                {/* Date */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-zinc-700 flex items-center gap-2">
                                        <Calendar size={13} /> Date Recorded
                                    </label>
                                    <input
                                        type="date"
                                        name="dateRecorded"
                                        value={form.dateRecorded}
                                        onChange={handleChange}
                                        className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none max-w-xs"
                                    />
                                </div>

                                <hr className="border-zinc-200" />

                                {/* Media URLs */}
                                <h3 className="font-bold text-zinc-900 -mb-2 flex items-center gap-2">
                                    <Link2 size={15} /> Media Links
                                </h3>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-zinc-700">
                                        Video URL (YouTube)
                                    </label>
                                    <input
                                        type="url"
                                        name="videoUrl"
                                        value={form.videoUrl}
                                        onChange={handleChange}
                                        className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none text-sm"
                                        placeholder="https://youtube.com/watch?v=..."
                                    />
                                </div>

                                {/* Submit */}
                                <div className="flex justify-end pt-4 mt-2 border-t border-zinc-200">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-light transition-colors shadow-lg disabled:opacity-50"
                                    >
                                        <Save size={16} />
                                        {saving ? "Saving..." : editingId ? "Update Session" : "Save Session"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center py-20">
                            <Video size={48} className="text-zinc-200 mb-4" />
                            <h3 className="text-lg font-bold text-zinc-400">Select or Add a Session</h3>
                            <p className="text-sm text-zinc-400 mt-1">Click a session to edit, or add a new one.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

