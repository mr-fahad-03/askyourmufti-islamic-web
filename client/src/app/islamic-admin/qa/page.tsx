"use client";

import React, { useState, useEffect, useRef } from "react";
import {
    Save, Plus, ArrowLeft, Edit2, Trash2, MessageSquareQuote,
    Upload, Download, Search, Loader2, X, FileSpreadsheet, Check, AlertCircle
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface FAQ {
    _id: string;
    qid: string;
    sessionNumber: string;
    timestamp: string;
    question: string;
    fullAnswer: string;
    shortAnswer: string;
    topic: string;
    subtopic: string;
    keywords: string[];
    questionerName: string;
    location: string;
    slug: string;
    seoMetaTitle: string;
    seoMetaDescription: string;
    translations?: {
        ur?: {
            question?: string;
            shortAnswer?: string;
            fullAnswer?: string;
            seoMetaTitle?: string;
            seoMetaDescription?: string;
        };
        de?: {
            question?: string;
            shortAnswer?: string;
            fullAnswer?: string;
            seoMetaTitle?: string;
            seoMetaDescription?: string;
        };
        fr?: {
            question?: string;
            shortAnswer?: string;
            fullAnswer?: string;
            seoMetaTitle?: string;
            seoMetaDescription?: string;
        };
        es?: {
            question?: string;
            shortAnswer?: string;
            fullAnswer?: string;
            seoMetaTitle?: string;
            seoMetaDescription?: string;
        };
    };
}

interface TopicItem {
    _id: string;
    name: string;
    slug: string;
}

const emptyForm = {
    sessionNumber: "",
    timestamp: "",
    questionerName: "",
    location: "",
    question: "",
    shortAnswer: "",
    fullAnswer: "",
    topic: "",
    subtopic: "",
    keywords: "",
    slug: "",
    seoMetaTitle: "",
    seoMetaDescription: "",
    translations: {
        ur: { question: "", shortAnswer: "", fullAnswer: "", seoMetaTitle: "", seoMetaDescription: "" },
        de: { question: "", shortAnswer: "", fullAnswer: "", seoMetaTitle: "", seoMetaDescription: "" },
        fr: { question: "", shortAnswer: "", fullAnswer: "", seoMetaTitle: "", seoMetaDescription: "" },
        es: { question: "", shortAnswer: "", fullAnswer: "", seoMetaTitle: "", seoMetaDescription: "" },
    },
};

function slugify(text: string) {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
        .slice(0, 80);
}

export default function QAManagerPage() {
    const [view, setView] = useState<"list" | "add" | "upload">("list");
    const [qaList, setQaList] = useState<FAQ[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeLang, setActiveLang] = useState<"en" | "ur" | "de" | "fr" | "es">("en");
    const [topicOptions, setTopicOptions] = useState<TopicItem[]>([]);
    const [topicsLoading, setTopicsLoading] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [uploadResult, setUploadResult] = useState<{ inserted: number; skipped: number } | null>(null);
    const [uploadError, setUploadError] = useState("");
    const [uploading, setUploading] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchQAs();
        fetchTopics();
    }, []);

    const fetchQAs = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/qa`);
            const data = await res.json();
            setQaList(data);
        } catch (error) {
            console.error("Fetch Error:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTopics = async () => {
        try {
            setTopicsLoading(true);
            const res = await fetch(`${API_URL}/topics`);
            const data = await res.json();
            setTopicOptions(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Topics Fetch Error:", error);
            setTopicOptions([]);
        } finally {
            setTopicsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const updated = { ...formData, [e.target.name]: e.target.value } as typeof formData;
        // Auto-generate slug from question
        if (e.target.name === "question" && !editingId) {
            updated.slug = slugify(e.target.value);
        }
        setFormData(updated);
    };

    const handleTranslationChange = (
        lang: "ur" | "de" | "fr" | "es",
        field: "question" | "shortAnswer" | "fullAnswer" | "seoMetaTitle" | "seoMetaDescription",
        value: string
    ) => {
        setFormData((prev) => ({
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

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const payload = {
                ...formData,
                qid: editingId ? undefined : `Q-${Date.now()}`,
                keywords: formData.keywords.split(",").map((k) => k.trim()).filter(Boolean),
                translations: {
                    ur: { ...formData.translations.ur },
                    de: { ...formData.translations.de },
                    fr: { ...formData.translations.fr },
                    es: { ...formData.translations.es },
                },
            };

            const url = editingId ? `${API_URL}/qa/${editingId}` : `${API_URL}/qa`;
            const method = editingId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
                setView("list");
                setEditingId(null);
                setActiveLang("en");
                setFormData(emptyForm);
                fetchQAs();
            }
        } catch (error) {
            console.error("Save Error:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (item: FAQ) => {
        setEditingId(item._id);
        setActiveLang("en");
        setFormData({
            sessionNumber: item.sessionNumber || "",
            timestamp: item.timestamp || "",
            questionerName: item.questionerName || "",
            location: item.location || "",
            question: item.question || "",
            shortAnswer: item.shortAnswer || "",
            fullAnswer: item.fullAnswer || "",
            topic: item.topic || "",
            subtopic: item.subtopic || "",
            keywords: (item.keywords || []).join(", "),
            slug: item.slug || "",
            seoMetaTitle: item.seoMetaTitle || "",
            seoMetaDescription: item.seoMetaDescription || "",
            translations: {
                ur: {
                    question: item.translations?.ur?.question || "",
                    shortAnswer: item.translations?.ur?.shortAnswer || "",
                    fullAnswer: item.translations?.ur?.fullAnswer || "",
                    seoMetaTitle: item.translations?.ur?.seoMetaTitle || "",
                    seoMetaDescription: item.translations?.ur?.seoMetaDescription || "",
                },
                de: {
                    question: item.translations?.de?.question || "",
                    shortAnswer: item.translations?.de?.shortAnswer || "",
                    fullAnswer: item.translations?.de?.fullAnswer || "",
                    seoMetaTitle: item.translations?.de?.seoMetaTitle || "",
                    seoMetaDescription: item.translations?.de?.seoMetaDescription || "",
                },
                fr: {
                    question: item.translations?.fr?.question || "",
                    shortAnswer: item.translations?.fr?.shortAnswer || "",
                    fullAnswer: item.translations?.fr?.fullAnswer || "",
                    seoMetaTitle: item.translations?.fr?.seoMetaTitle || "",
                    seoMetaDescription: item.translations?.fr?.seoMetaDescription || "",
                },
                es: {
                    question: item.translations?.es?.question || "",
                    shortAnswer: item.translations?.es?.shortAnswer || "",
                    fullAnswer: item.translations?.es?.fullAnswer || "",
                    seoMetaTitle: item.translations?.es?.seoMetaTitle || "",
                    seoMetaDescription: item.translations?.es?.seoMetaDescription || "",
                },
            },
        });
        setView("add");
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/qa/${id}`, { method: "DELETE" });
            if (res.ok) {
                fetchQAs();
                setDeleteConfirm(null);
            }
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        setUploadResult(null);
        setUploadError("");

        try {
            const text = await file.text();
            let rows: Record<string, string>[] = [];

            if (file.name.endsWith(".csv")) {
                // Parse CSV
                const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
                if (lines.length < 2) throw new Error("CSV must have a header row and data rows");
                const headers = lines[0].split(",").map((h) => h.trim());
                for (let i = 1; i < lines.length; i++) {
                    // Handle quoted CSV values
                    const values: string[] = [];
                    let current = "";
                    let inQuotes = false;
                    for (const char of lines[i]) {
                        if (char === '"') {
                            inQuotes = !inQuotes;
                        } else if (char === "," && !inQuotes) {
                            values.push(current.trim());
                            current = "";
                        } else {
                            current += char;
                        }
                    }
                    values.push(current.trim());

                    const row: Record<string, string> = {};
                    headers.forEach((h, j) => {
                        row[h] = values[j] || "";
                    });
                    if (row.Question_EN || row.Question || row.Q_ID) rows.push(row);
                }
            } else {
                throw new Error("Please upload a .csv file. Download the sample template below.");
            }

            if (rows.length === 0) throw new Error("No valid data rows found");

            const res = await fetch(`${API_URL}/qa/bulk`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rows }),
            });

            const data = await res.json();
            if (res.ok) {
                setUploadResult({ inserted: data.inserted, skipped: data.skipped });
                fetchQAs();
            } else {
                throw new Error(data.message || "Upload failed");
            }
        } catch (err: any) {
            setUploadError(err.message || "Upload failed");
        } finally {
            setUploading(false);
            if (fileRef.current) fileRef.current.value = "";
        }
    };

    const downloadSampleCSV = () => {
    // 34 columns: 3 common + 5 languages x 5 fields + 6 shared
    const headers = [
        "Q_ID", "Session", "Timestamp",
        "Question_EN", "Short_Answer_EN", "Full_Answer_EN", "Meta_Title_EN", "Meta_Description_EN",
        "Question_UR", "Short_Answer_UR", "Full_Answer_UR", "Meta_Title_UR", "Meta_Description_UR",
        "Question_DE", "Short_Answer_DE", "Full_Answer_DE", "Meta_Title_DE", "Meta_Description_DE",
        "Question_FR", "Short_Answer_FR", "Full_Answer_FR", "Meta_Title_FR", "Meta_Description_FR",
        "Question_ES", "Short_Answer_ES", "Full_Answer_ES", "Meta_Title_ES", "Meta_Description_ES",
        "Topic", "Subtopic", "Keywords", "Questioner_Name", "Location", "Slug",
    ];

    const sampleRows = [
        [
            "Q-001", "522", "00:05:30",
            "Is zakat obligatory on savings?", "Yes, if savings reach nisab.", "Zakat is due annually on qualifying savings at 2.5 percent.", "Is Zakat Obligatory on Savings?", "Understand zakat ruling for savings.",
            "Kya bachaton par zakat farz hai?", "Ji haan, agar nisab poora ho.", "Agar bachat nisab tak pohnch jaye to saalana 2.5 percent zakat ada ki jati hai.", "Kya bachaton par zakat farz hai?", "Savings par zakat ka hukm maloom karein.",
            "Ist Zakat auf Ersparnisse Pflicht?", "Ja, wenn der Nisab erreicht ist.", "Auf qualifizierte Ersparnisse ist jahrlich 2.5 Prozent Zakat fallig.", "Ist Zakat auf Ersparnisse Pflicht?", "Erklarung zur Zakat auf Ersparnisse.",
            "La zakat est-elle obligatoire sur les economies?", "Oui, si le nisab est atteint.", "La zakat est due chaque annee sur les economies eligibles a hauteur de 2,5%.", "La zakat sur les economies", "Comprendre la regle de la zakat sur les economies.",
            "Es obligatoria la zakat sobre ahorros?", "Si, cuando se alcanza el nisab.", "La zakat se paga anualmente sobre ahorros elegibles al 2.5 por ciento.", "Zakat sobre ahorros", "Regla de zakat para ahorros.",
            "Zakat", "Savings", "zakat,savings,nisab", "Ahmed", "Karachi", "is-zakat-obligatory-on-savings"
        ]
    ];

    const csvContent = [
        headers.join(","),
        ...sampleRows.map((row) => row.map((val) => `"${val.replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "qa_multilingual_template.csv";
    a.click();
    URL.revokeObjectURL(url);
};

const filteredQAs = qaList.filter(
        (q) =>
            q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.sessionNumber.includes(searchQuery)
    );

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-zinc-900">Q&A Manager</h1>
                    <p className="text-zinc-500 mt-1">
                        {qaList.length} questions total
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {view === "list" ? (
                        <>
                            <button
                                onClick={downloadSampleCSV}
                                className="flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent border border-accent/20 rounded-xl text-sm font-semibold hover:bg-accent/20 transition-colors"
                            >
                                <Download size={16} /> CSV Template
                            </button>
                            <button
                                onClick={() => { setView("upload"); setUploadResult(null); setUploadError(""); }}
                                className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-zinc-700 rounded-xl text-sm font-semibold hover:bg-zinc-200 transition-colors"
                            >
                                <Upload size={16} /> CSV Upload
                            </button>
                            <button
                                onClick={() => { setView("add"); setEditingId(null); setActiveLang("en"); setFormData(emptyForm); }}
                                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors shadow-sm"
                            >
                                <Plus size={16} /> Add Q&A
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => { setView("list"); setEditingId(null); setActiveLang("en"); setFormData(emptyForm); }}
                            className="flex items-center gap-2 px-4 py-2 bg-zinc-200 text-zinc-700 rounded-xl text-sm font-semibold hover:bg-zinc-300 transition-colors"
                        >
                            <ArrowLeft size={16} /> Back to List
                        </button>
                    )}
                </div>
            </div>

            {/* CSV Upload View */}
            {view === "upload" && (
                <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-zinc-200 bg-zinc-50 flex items-center gap-3">
                        <FileSpreadsheet size={20} className="text-primary" />
                        <h2 className="text-lg font-bold text-zinc-900">Bulk Upload Q&A via CSV</h2>
                    </div>

                    <div className="p-8 flex flex-col items-center gap-6">
                        {/* Download sample */}
                        <button
                            onClick={downloadSampleCSV}
                            className="flex items-center gap-2 px-6 py-3 bg-accent/10 text-accent border border-accent/20 rounded-xl font-semibold hover:bg-accent/20 transition-colors"
                        >
                            <Download size={16} /> Download 5-Language CSV Template
                        </button>

                        <p className="text-sm text-zinc-500 max-w-lg text-center">
                            Each row is one Q&A entry with content in all <strong>5 languages</strong>.
                            Columns are grouped by language: <strong>EN - UR - DE - FR - ES</strong>.
                            Each language has these fields: Question, Short Answer, Full Answer, SEO Title, SEO Description.
                            The <strong>Topic</strong> column auto-groups questions. Only English fields are required; other languages are optional.
                        </p>

                        {/* Language legend */}
                        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
                            {[
                                { code: "EN", label: "English", bg: "bg-blue-50 text-blue-700 border-blue-200" },
                                { code: "UR", label: "Urdu", bg: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                                { code: "DE", label: "German", bg: "bg-yellow-50 text-yellow-700 border-yellow-200" },
                                { code: "FR", label: "French", bg: "bg-purple-50 text-purple-700 border-purple-200" },
                                { code: "ES", label: "Spanish", bg: "bg-red-50 text-red-700 border-red-200" },
                            ].map(({ code, label, bg }) => (
                                <span key={code} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${bg}`}>
                                    <span>{code}</span> <span className="opacity-70">- {label}</span>
                                </span>
                            ))}
                        </div>

                        {/* Upload area */}
                        <label className="w-full max-w-lg cursor-pointer">
                            <div className="border-2 border-dashed border-zinc-300 rounded-2xl p-10 text-center hover:border-primary/50 transition-colors">
                                {uploading ? (
                                    <Loader2 size={32} className="animate-spin text-primary mx-auto mb-3" />
                                ) : (
                                    <Upload size={32} className="text-zinc-300 mx-auto mb-3" />
                                )}
                                <p className="text-sm font-semibold text-zinc-600">
                                    {uploading ? "Uploading..." : "Click to select CSV file"}
                                </p>
                                <p className="text-xs text-zinc-400 mt-1">Supports .csv format</p>
                            </div>
                            <input
                                ref={fileRef}
                                type="file"
                                accept=".csv"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                        </label>

                        {/* Result */}
                        {uploadResult && (
                            <div className="flex items-center gap-3 px-6 py-4 bg-green-50 border border-green-200 rounded-xl w-full max-w-lg">
                                <Check size={20} className="text-green-600" />
                                <div className="text-sm">
                                    <p className="font-bold text-green-700">Upload successful!</p>
                                    <p className="text-green-600">{uploadResult.inserted} inserted, {uploadResult.skipped} skipped (duplicates)</p>
                                </div>
                            </div>
                        )}

                        {uploadError && (
                            <div className="flex items-center gap-3 px-6 py-4 bg-red-50 border border-red-200 rounded-xl w-full max-w-lg">
                                <AlertCircle size={20} className="text-red-600" />
                                <p className="text-sm font-medium text-red-700">{uploadError}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Add/Edit Form */}
            {view === "add" && (
                <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-zinc-200 bg-zinc-50 flex items-center gap-3">
                        <MessageSquareQuote size={20} className="text-primary" />
                        <h2 className="text-lg font-bold text-zinc-900">
                            {editingId ? "Edit Q&A" : "Add New Q&A"}
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

                    <form className="p-6 flex flex-col gap-6" onSubmit={handleSave}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-zinc-700">Session # *</label>
                                <input type="text" name="sessionNumber" value={formData.sessionNumber} onChange={handleChange} required
                                    className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none font-mono"
                                    placeholder="522" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-zinc-700">Timestamp</label>
                                <input type="text" name="timestamp" value={formData.timestamp} onChange={handleChange}
                                    className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="00:15:30" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-zinc-700">Questioner</label>
                                <input type="text" name="questionerName" value={formData.questionerName} onChange={handleChange}
                                    className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="Anonymous" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-zinc-700">Location</label>
                                <input type="text" name="location" value={formData.location} onChange={handleChange}
                                    className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="Karachi" />
                            </div>
                        </div>

                        <hr className="border-zinc-200" />

                        {activeLang === "en" ? (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-zinc-700">Question (EN) *</label>
                                    <input type="text" name="question" value={formData.question} onChange={handleChange} required
                                        className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                        placeholder="Is zakat wajib on gold along with pocket money?" />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-zinc-700">Short Answer (EN)</label>
                                    <textarea name="shortAnswer" value={formData.shortAnswer} onChange={handleChange} rows={2}
                                        className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none resize-y"
                                        placeholder="Brief answer..." />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-zinc-700">Full Answer (EN) *</label>
                                    <textarea name="fullAnswer" value={formData.fullAnswer} onChange={handleChange} rows={6} required
                                        className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none resize-y"
                                        placeholder="Full detailed answer..." />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-zinc-700">Question ({activeLang.toUpperCase()})</label>
                                    <input
                                        type="text"
                                        value={formData.translations[activeLang].question}
                                        onChange={(e) => handleTranslationChange(activeLang, "question", e.target.value)}
                                        className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                        placeholder={`Translated question in ${activeLang.toUpperCase()}`}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-zinc-700">Short Answer ({activeLang.toUpperCase()})</label>
                                    <textarea
                                        rows={2}
                                        value={formData.translations[activeLang].shortAnswer}
                                        onChange={(e) => handleTranslationChange(activeLang, "shortAnswer", e.target.value)}
                                        className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none resize-y"
                                        placeholder={`Translated short answer in ${activeLang.toUpperCase()}`}
                                    />
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-zinc-700">Full Answer ({activeLang.toUpperCase()})</label>
                                    <textarea
                                        rows={6}
                                        value={formData.translations[activeLang].fullAnswer}
                                        onChange={(e) => handleTranslationChange(activeLang, "fullAnswer", e.target.value)}
                                        className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none resize-y"
                                        placeholder={`Translated full answer in ${activeLang.toUpperCase()}`}
                                    />
                                </div>
                            </>
                        )}

                        <hr className="border-zinc-200" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-zinc-700">Topic *</label>
                                <select
                                    name="topic"
                                    value={formData.topic}
                                    onChange={handleChange}
                                    required
                                    className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                >
                                    <option value="">
                                        {topicsLoading ? "Loading topics..." : "Select topic"}
                                    </option>
                                    {topicOptions.map((topic) => (
                                        <option key={topic._id} value={topic.name}>
                                            {topic.name}
                                        </option>
                                    ))}
                                    {formData.topic && !topicOptions.some((topic) => topic.name === formData.topic) && (
                                        <option value={formData.topic}>{formData.topic}</option>
                                    )}
                                </select>
                                {!topicsLoading && topicOptions.length === 0 && (
                                    <p className="text-xs text-amber-600">
                                        No topics found. Add topics first in the Topics page.
                                    </p>
                                )}
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-zinc-700">Subtopic</label>
                                <input type="text" name="subtopic" value={formData.subtopic} onChange={handleChange}
                                    className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="Gold Zakat" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-zinc-700">Keywords (comma-separated)</label>
                                <input type="text" name="keywords" value={formData.keywords} onChange={handleChange}
                                    className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                    placeholder="zakat, gold, nisab" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-zinc-700">URL Slug *</label>
                                <input type="text" name="slug" value={formData.slug} onChange={handleChange} required
                                    className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none font-mono text-sm"
                                    placeholder="is-zakat-wajib-on-gold" />
                            </div>
                            {activeLang === "en" ? (
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-zinc-700">SEO Meta Title (EN)</label>
                                    <input type="text" name="seoMetaTitle" value={formData.seoMetaTitle} onChange={handleChange}
                                        className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                        placeholder="SEO title..." />
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-zinc-700">SEO Meta Title ({activeLang.toUpperCase()})</label>
                                    <input
                                        type="text"
                                        value={formData.translations[activeLang].seoMetaTitle}
                                        onChange={(e) => handleTranslationChange(activeLang, "seoMetaTitle", e.target.value)}
                                        className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                        placeholder={`Translated SEO title in ${activeLang.toUpperCase()}`}
                                    />
                                </div>
                            )}
                        </div>

                        {activeLang === "en" ? (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-zinc-700">SEO Meta Description (EN)</label>
                                <textarea
                                    name="seoMetaDescription"
                                    value={formData.seoMetaDescription}
                                    onChange={handleChange}
                                    rows={2}
                                    className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none resize-y"
                                    placeholder="SEO description..."
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-zinc-700">SEO Meta Description ({activeLang.toUpperCase()})</label>
                                <textarea
                                    rows={2}
                                    value={formData.translations[activeLang].seoMetaDescription}
                                    onChange={(e) => handleTranslationChange(activeLang, "seoMetaDescription", e.target.value)}
                                    className="px-4 py-2.5 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none resize-y"
                                    placeholder={`Translated SEO description in ${activeLang.toUpperCase()}`}
                                />
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t border-zinc-200">
                            <button type="submit" disabled={saving}
                                className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-light transition-colors shadow-lg disabled:opacity-50">
                                <Save size={16} />
                                {saving ? "Saving..." : editingId ? "Update Q&A" : "Save Q&A"}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List View */}
            {view === "list" && (
                <>
                    {/* Search */}
                    <div className="relative max-w-md">
                        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
                        <input type="text" placeholder="Search by question, topic, session..."
                            value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-900 text-sm focus:ring-2 focus:ring-primary/50 outline-none" />
                    </div>

                    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 size={24} className="animate-spin text-primary" />
                            </div>
                        ) : filteredQAs.length === 0 ? (
                            <div className="text-center py-16">
                                <MessageSquareQuote size={40} className="mx-auto text-zinc-300 mb-3" />
                                <p className="text-zinc-500 text-sm">
                                    {qaList.length === 0 ? "No Q&A entries yet. Add one or upload CSV!" : "No matching results."}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-sm">
                                    <thead className="bg-zinc-50 text-zinc-500 border-b border-zinc-200">
                                        <tr>
                                            <th className="px-5 py-3.5 font-medium">Session</th>
                                            <th className="px-5 py-3.5 font-medium">Question</th>
                                            <th className="px-5 py-3.5 font-medium">Topic</th>
                                            <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-zinc-100">
                                        {filteredQAs.map((item) => (
                                            <tr key={item._id} className="hover:bg-zinc-50 transition-colors">
                                                <td className="px-5 py-3.5 font-mono text-xs font-bold text-primary">#{item.sessionNumber}</td>
                                                <td className="px-5 py-3.5 text-zinc-700 max-w-[300px] truncate">{item.question}</td>
                                                <td className="px-5 py-3.5">
                                                    <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-bold">{item.topic}</span>
                                                </td>
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button onClick={() => handleEdit(item)} className="text-zinc-400 hover:text-primary transition-colors p-1">
                                                            <Edit2 size={15} />
                                                        </button>
                                                        {deleteConfirm === item._id ? (
                                                            <div className="flex items-center gap-1">
                                                                <button onClick={() => handleDelete(item._id)} className="text-xs text-red-600 font-bold hover:underline px-1">Yes</button>
                                                                <button onClick={() => setDeleteConfirm(null)} className="text-xs text-zinc-400 hover:underline px-1">No</button>
                                                            </div>
                                                        ) : (
                                                            <button onClick={() => setDeleteConfirm(item._id)} className="text-zinc-400 hover:text-red-500 transition-colors p-1">
                                                                <Trash2 size={15} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}


