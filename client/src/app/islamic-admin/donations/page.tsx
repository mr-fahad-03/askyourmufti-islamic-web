"use client";

import React, { useState, useEffect } from "react";
import { Heart, Plus, Edit2, Trash2, X, Building2, CreditCard, Globe, ToggleLeft, ToggleRight, Save } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

interface DonationAccount {
    _id: string;
    bankName: string;
    accountHolder: string;
    accountNumber: string;
    iban: string;
    swiftBic: string;
    branchName: string;
    branchCode: string;
    currency: string;
    country: string;
    purpose: string;
    notes: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

const emptyForm = {
    bankName: "",
    accountHolder: "",
    accountNumber: "",
    iban: "",
    swiftBic: "",
    branchName: "",
    branchCode: "",
    currency: "EUR",
    country: "Germany",
    purpose: "Donation for Islamic Education",
    notes: "",
    isActive: true,
};

export default function DonationManagerPage() {
    const [accounts, setAccounts] = useState<DonationAccount[]>([]);
    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    const fetchAccounts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_URL}/donations/all`);
            const data = await res.json();
            setAccounts(data);
        } catch (err) {
            console.error("Failed to fetch donation accounts", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const url = editingId ? `${API_URL}/donations/${editingId}` : `${API_URL}/donations`;
            const method = editingId ? "PUT" : "POST";
            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            if (res.ok) {
                await fetchAccounts();
                resetForm();
            }
        } catch (err) {
            console.error("Failed to save donation account", err);
        } finally {
            setSaving(false);
        }
    };

    const handleEdit = (account: DonationAccount) => {
        setEditingId(account._id);
        setIsAdding(false);
        setForm({
            bankName: account.bankName,
            accountHolder: account.accountHolder,
            accountNumber: account.accountNumber,
            iban: account.iban || "",
            swiftBic: account.swiftBic || "",
            branchName: account.branchName || "",
            branchCode: account.branchCode || "",
            currency: account.currency || "EUR",
            country: account.country || "Germany",
            purpose: account.purpose || "",
            notes: account.notes || "",
            isActive: account.isActive,
        });
    };

    const handleDelete = async (id: string) => {
        try {
            const res = await fetch(`${API_URL}/donations/${id}`, { method: "DELETE" });
            if (res.ok) {
                await fetchAccounts();
                if (editingId === id) resetForm();
            }
        } catch (err) {
            console.error("Failed to delete", err);
        }
        setDeleteConfirm(null);
    };

    const toggleActive = async (account: DonationAccount) => {
        try {
            await fetch(`${API_URL}/donations/${account._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !account.isActive }),
            });
            await fetchAccounts();
        } catch (err) {
            console.error("Failed to toggle", err);
        }
    };

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
        setIsAdding(false);
    };

    const startAdding = () => {
        setEditingId(null);
        setForm(emptyForm);
        setIsAdding(true);
    };

    const showForm = isAdding || editingId;

    return (
        <div className="flex flex-col gap-8 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-serif font-bold text-zinc-900">Donation Accounts</h1>
                    <p className="text-zinc-500 mt-1">Manage bank details shown on the public Donate page.</p>
                </div>
                <button
                    onClick={showForm ? resetForm : startAdding}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary-light transition-colors shadow-sm"
                >
                    {showForm ? <><X size={16} /> Cancel</> : <><Plus size={16} /> Add Account</>}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Account List */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    <h2 className="text-lg font-bold text-zinc-900 mb-2">
                        Bank Accounts ({accounts.length})
                    </h2>

                    {loading ? (
                        <div className="text-center py-12 text-zinc-400">Loading...</div>
                    ) : accounts.length === 0 ? (
                        <div className="text-center py-12 bg-white border border-zinc-200 rounded-xl">
                            <Building2 size={40} className="mx-auto text-zinc-300 mb-3" />
                            <p className="text-zinc-500 text-sm">No accounts yet. Add one to get started.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-3">
                            {accounts.map((acc) => (
                                <div
                                    key={acc._id}
                                    className={`bg-white border p-4 rounded-xl flex flex-col gap-3 transition-colors cursor-pointer ${
                                        editingId === acc._id
                                            ? "border-primary ring-2 ring-primary/20"
                                            : "border-zinc-200 hover:border-primary/50"
                                    }`}
                                    onClick={() => handleEdit(acc)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-zinc-900 truncate">{acc.bankName}</h3>
                                                <span className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${acc.isActive ? "bg-emerald-500" : "bg-zinc-300"}`} />
                                            </div>
                                            <p className="text-sm text-zinc-500 truncate">{acc.accountHolder}</p>
                                            <p className="text-xs text-zinc-400 mt-1 font-mono truncate">{acc.iban || acc.accountNumber}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-1 border-t border-zinc-100">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleActive(acc); }}
                                            className="text-zinc-400 hover:text-primary transition-colors p-1"
                                            title={acc.isActive ? "Deactivate" : "Activate"}
                                        >
                                            {acc.isActive ? <ToggleRight size={18} className="text-emerald-500" /> : <ToggleLeft size={18} />}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEdit(acc); }}
                                            className="text-zinc-400 hover:text-primary transition-colors p-1"
                                        >
                                            <Edit2 size={15} />
                                        </button>
                                        {deleteConfirm === acc._id ? (
                                            <div className="flex items-center gap-1 ml-auto">
                                                <span className="text-xs text-red-500 font-medium">Delete?</span>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDelete(acc._id); }}
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
                                                onClick={(e) => { e.stopPropagation(); setDeleteConfirm(acc._id); }}
                                                className="text-zinc-400 hover:text-red-500 transition-colors p-1"
                                            >
                                                <Trash2 size={15} />
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
                                <Heart size={20} className="text-primary" />
                                <h2 className="text-lg font-bold text-zinc-900">
                                    {editingId ? "Edit Bank Account" : "Add New Bank Account"}
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6">
                                {/* Bank & Holder */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-zinc-700">Bank Name *</label>
                                        <input
                                            type="text"
                                            name="bankName"
                                            value={form.bankName}
                                            onChange={handleChange}
                                            required
                                            className="px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="e.g. Deutsche Bank"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-zinc-700">Account Holder *</label>
                                        <input
                                            type="text"
                                            name="accountHolder"
                                            value={form.accountHolder}
                                            onChange={handleChange}
                                            required
                                            className="px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="Full name on account"
                                        />
                                    </div>
                                </div>

                                {/* Account Number & IBAN */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-zinc-700">Account Number *</label>
                                        <input
                                            type="text"
                                            name="accountNumber"
                                            value={form.accountNumber}
                                            onChange={handleChange}
                                            required
                                            className="px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none font-mono"
                                            placeholder="Account number"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-zinc-700">IBAN</label>
                                        <input
                                            type="text"
                                            name="iban"
                                            value={form.iban}
                                            onChange={handleChange}
                                            className="px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none font-mono"
                                            placeholder="DE89 3704 0044 0532 0130 00"
                                        />
                                    </div>
                                </div>

                                {/* SWIFT & Branch */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-zinc-700">SWIFT / BIC</label>
                                        <input
                                            type="text"
                                            name="swiftBic"
                                            value={form.swiftBic}
                                            onChange={handleChange}
                                            className="px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none font-mono"
                                            placeholder="DEUTDEDB"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-zinc-700">Branch Name</label>
                                        <input
                                            type="text"
                                            name="branchName"
                                            value={form.branchName}
                                            onChange={handleChange}
                                            className="px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="Main Branch"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-zinc-700">Branch Code</label>
                                        <input
                                            type="text"
                                            name="branchCode"
                                            value={form.branchCode}
                                            onChange={handleChange}
                                            className="px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none font-mono"
                                            placeholder="370 400 44"
                                        />
                                    </div>
                                </div>

                                <hr className="border-zinc-200" />

                                {/* Currency, Country & Purpose */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-zinc-700">Currency</label>
                                        <select
                                            name="currency"
                                            value={form.currency}
                                            onChange={handleChange}
                                            className="px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                        >
                                            <option value="EUR">EUR (€)</option>
                                            <option value="USD">USD ($)</option>
                                            <option value="GBP">GBP (£)</option>
                                            <option value="PKR">PKR (₨)</option>
                                            <option value="SAR">SAR (﷼)</option>
                                            <option value="AED">AED (د.إ)</option>
                                        </select>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-zinc-700">Country</label>
                                        <input
                                            type="text"
                                            name="country"
                                            value={form.country}
                                            onChange={handleChange}
                                            className="px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="Germany"
                                        />
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <label className="text-sm font-semibold text-zinc-700">Purpose</label>
                                        <input
                                            type="text"
                                            name="purpose"
                                            value={form.purpose}
                                            onChange={handleChange}
                                            className="px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none"
                                            placeholder="Donation for Islamic Education"
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-semibold text-zinc-700">Notes (optional)</label>
                                    <textarea
                                        name="notes"
                                        value={form.notes}
                                        onChange={(e) => setForm({ ...form, notes: e.target.value })}
                                        rows={3}
                                        className="px-4 py-2 rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 focus:ring-2 focus:ring-primary/50 outline-none resize-y"
                                        placeholder="Any additional instructions for donors..."
                                    />
                                </div>

                                {/* Active Toggle */}
                                <div className="flex items-center gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, isActive: !form.isActive })}
                                        className="text-zinc-400 hover:text-primary transition-colors"
                                    >
                                        {form.isActive ? (
                                            <ToggleRight size={28} className="text-emerald-500" />
                                        ) : (
                                            <ToggleLeft size={28} />
                                        )}
                                    </button>
                                    <span className="text-sm font-medium text-zinc-700">
                                        {form.isActive ? "Active — visible on public page" : "Inactive — hidden from public page"}
                                    </span>
                                </div>

                                <div className="flex justify-end pt-4 mt-2 border-t border-zinc-200">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary-light transition-colors shadow-lg disabled:opacity-50"
                                    >
                                        <Save size={16} />
                                        {saving ? "Saving..." : editingId ? "Update Account" : "Save Account"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm flex flex-col items-center justify-center py-20">
                            <CreditCard size={48} className="text-zinc-200 mb-4" />
                            <h3 className="text-lg font-bold text-zinc-400">Select or Add an Account</h3>
                            <p className="text-sm text-zinc-400 mt-1">Click a bank account to edit, or add a new one.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

