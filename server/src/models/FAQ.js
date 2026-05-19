const mongoose = require('mongoose');

const translationBlock = {
    question:           { type: String, default: "" },
    shortAnswer:        { type: String, default: "" },
    fullAnswer:         { type: String, default: "" },
    seoMetaTitle:       { type: String, default: "" },
    seoMetaDescription: { type: String, default: "" },
};

const FAQSchema = new mongoose.Schema(
    {
        qid:           { type: String, required: true, unique: true },
        sessionNumber: { type: String, required: true },
        timestamp:     { type: String },

        // ── Primary language: English ──
        question:           { type: String, required: true },
        shortAnswer:        { type: String },
        fullAnswer:         { type: String, required: true },
        seoMetaTitle:       { type: String },
        seoMetaDescription: { type: String },

        // ── Shared fields ──
        topic:         { type: String, required: true },
        subtopic:      { type: String },
        keywords:      [{ type: String }],
        questionerName:{ type: String },
        location:      { type: String },
        slug:          { type: String, required: true, unique: true },
        viewCount:     { type: Number, default: 0 },

        // ── Translations (ur · de · es · fr) ──
        translations: {
            ur: translationBlock,
            de: translationBlock,
            es: translationBlock,
            fr: translationBlock,
        },
    },
    { timestamps: true }
);

// Index for search optimization
FAQSchema.index({ question: "text", fullAnswer: "text", keywords: "text" });

module.exports = mongoose.model('FAQ', FAQSchema);
