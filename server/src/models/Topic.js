const mongoose = require('mongoose');

const TopicSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, unique: true },
        slug: { type: String, required: true, unique: true },
        description: { type: String },
        subtopics: [{ type: String }],
        seoTitle: { type: String },
        seoDescription: { type: String },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Topic', TopicSchema);
