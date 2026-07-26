const FAQ = require('../models/FAQ');
const Topic = require('../models/Topic');
const SUPPORTED_LANGS = ['en', 'ur', 'de', 'fr', 'es'];

const resolveLang = (lang) => {
    if (!lang || typeof lang !== 'string') return 'en';
    const normalized = lang.toLowerCase();
    return SUPPORTED_LANGS.includes(normalized) ? normalized : 'en';
};

const localizeFAQ = (faq, lang) => {
    const item = faq.toObject ? faq.toObject() : faq;
    if (lang === 'en') return item;

    const t = (item.translations && item.translations[lang]) || {};
    return {
        ...item,
        question: t.question || item.question,
        shortAnswer: t.shortAnswer || item.shortAnswer,
        fullAnswer: t.fullAnswer || item.fullAnswer,
        seoMetaTitle: t.seoMetaTitle || item.seoMetaTitle,
        seoMetaDescription: t.seoMetaDescription || item.seoMetaDescription,
    };
};

const escapeRegex = (value = '') => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normalizeTopicName = (value = '') => String(value).trim().replace(/\s+/g, ' ');

const slugify = (value = '') =>
    String(value)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');

const buildUniqueSlug = (baseSlug, usedSlugs) => {
    let slug = baseSlug || 'topic';
    if (!usedSlugs.has(slug)) {
        usedSlugs.add(slug);
        return slug;
    }

    let suffix = 2;
    while (usedSlugs.has(`${slug}-${suffix}`)) suffix += 1;
    const unique = `${slug}-${suffix}`;
    usedSlugs.add(unique);
    return unique;
};

const ensureTopicsFromBulkRows = async (rows) => {
    const uniqueByLowerName = new Map();
    rows.forEach((row) => {
        const name = normalizeTopicName(row.Topic);
        if (!name) return;
        const key = name.toLowerCase();
        if (!uniqueByLowerName.has(key)) uniqueByLowerName.set(key, name);
    });

    const topicNames = [...uniqueByLowerName.values()];
    if (topicNames.length === 0) return 0;

    const existingTopics = await Topic.find({}).select('name slug').lean();
    const existingNameSet = new Set(existingTopics.map((t) => String(t.name || '').toLowerCase()));
    const usedSlugs = new Set(existingTopics.map((t) => String(t.slug || '').toLowerCase()).filter(Boolean));

    const toCreate = [];
    topicNames.forEach((name) => {
        const lower = name.toLowerCase();
        if (existingNameSet.has(lower)) return;

        const slug = buildUniqueSlug(slugify(name), usedSlugs);
        toCreate.push({
            name,
            slug,
            description: `${name} related Islamic Q&A.`,
            subtopics: [],
            seoTitle: `${name} - Islamic Q&A`,
            seoDescription: `Browse Islamic questions and answers about ${name}.`,
        });
        existingNameSet.add(lower);
    });

    if (toCreate.length === 0) return 0;

    try {
        await Topic.insertMany(toCreate, { ordered: false });
        return toCreate.length;
    } catch (error) {
        if (error && error.code === 11000) {
            const inserted = Array.isArray(error.insertedDocs) ? error.insertedDocs.length : 0;
            return inserted;
        }
        throw error;
    }
};

// @desc    Get all questions
// @route   GET /api/qa
// @access  Public
const getFAQs = async (req, res) => {
    try {
        const lang = resolveLang(req.query.lang);
        const faqs = await FAQ.find({}).sort({ createdAt: -1 });
        res.json(faqs.map((faq) => localizeFAQ(faq, lang)));
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single question by slug
// @route   GET /api/qa/slug/:slug
// @access  Public
const getFAQBySlug = async (req, res) => {
    try {
        const lang = resolveLang(req.query.lang);
        const requestedQid = typeof req.query.qid === 'string' ? req.query.qid.trim() : '';

        let faq = null;
        if (requestedQid) {
            faq = await FAQ.findOneAndUpdate(
                { qid: requestedQid },
                { $inc: { viewCount: 1 } },
                { new: true }
            );
        }

        if (!faq) {
            const rawSlug = decodeURIComponent(String(req.params.slug || '')).trim();
            const normalizedSlug = rawSlug.replace(/^\/+|\/+$/g, '').split('#')[0];
            const exactCandidates = Array.from(new Set([
                rawSlug,
                `/${rawSlug}`,
                normalizedSlug,
                `/${normalizedSlug}`,
            ].filter(Boolean)));

            faq = await FAQ.findOneAndUpdate(
                { slug: { $in: exactCandidates } },
                { $inc: { viewCount: 1 } },
                { new: true, sort: { createdAt: -1 } }
            );

            if (!faq && normalizedSlug) {
                faq = await FAQ.findOneAndUpdate(
                    { slug: { $regex: new RegExp(`^/?${escapeRegex(normalizedSlug)}(?:#.*)?$`, 'i') } },
                    { $inc: { viewCount: 1 } },
                    { new: true, sort: { createdAt: -1 } }
                );
            }
        }

        if (!faq) return res.status(404).json({ message: 'Question not found' });
        res.json(localizeFAQ(faq, lang));
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get most viewed questions
// @route   GET /api/qa/trending
// @access  Public
const getTrendingFAQs = async (req, res) => {
    try {
        const lang = resolveLang(req.query.lang);
        const limitRaw = parseInt(req.query.limit, 10);
        const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 30) : 8;

        const faqs = await FAQ.find({})
            .sort({ viewCount: -1, createdAt: -1 })
            .limit(limit);

        res.json(faqs.map((faq) => localizeFAQ(faq, lang)));
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get questions by topic
// @route   GET /api/qa/topic/:topic
// @access  Public
const getFAQsByTopic = async (req, res) => {
    try {
        const lang = resolveLang(req.query.lang);
        const topic = decodeURIComponent(req.params.topic);
        const faqs = await FAQ.find({ topic: { $regex: new RegExp(`^${topic}$`, 'i') } }).sort({ sessionNumber: -1, createdAt: -1 });
        res.json(faqs.map((faq) => localizeFAQ(faq, lang)));
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get questions by session number
// @route   GET /api/qa/session/:sessionNumber
// @access  Public
const getFAQsBySession = async (req, res) => {
    try {
        const lang = resolveLang(req.query.lang);
        const faqs = await FAQ.find({ sessionNumber: req.params.sessionNumber }).sort({ topic: 1, createdAt: -1 });
        res.json(faqs.map((faq) => localizeFAQ(faq, lang)));
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all unique topics from Q&A
// @route   GET /api/qa/topics-list
// @access  Public
const getTopicsList = async (req, res) => {
    try {
        const topics = await FAQ.aggregate([
            { $group: { _id: '$topic', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        res.json(topics);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a question
// @route   POST /api/qa
// @access  Private/Admin
const createFAQ = async (req, res) => {
    try {
        const existing = await FAQ.findOne({
            $or: [{ qid: req.body.qid }, { slug: req.body.slug }]
        });

        if (existing) {
            return res.status(400).json({ message: 'Question ID or Slug already exists' });
        }

        const faq = await FAQ.create(req.body);
        res.status(201).json(faq);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

// @desc    Update a question
// @route   PUT /api/qa/:id
// @access  Private/Admin
const updateFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!faq) return res.status(404).json({ message: 'Question not found' });
        res.json(faq);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

// @desc    Delete a question
// @route   DELETE /api/qa/:id
// @access  Private/Admin
const deleteFAQ = async (req, res) => {
    try {
        const faq = await FAQ.findByIdAndDelete(req.params.id);
        if (!faq) return res.status(404).json({ message: 'Question not found' });
        res.json({ message: 'Question deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Bulk Upload Q&A
// @route   POST /api/qa/bulk
// @access  Private/Admin
const bulkUploadFAQs = async (req, res) => {
    try {
        const { rows } = req.body;
        if (!Array.isArray(rows)) {
            return res.status(400).json({ message: 'Invalid data format' });
        }

        const createdTopics = await ensureTopicsFromBulkRows(rows);

        // Fetch all existing qids and slugs from DB to build sets of used values
        const allFaqs = await FAQ.find({}, "qid slug").lean();
        const usedQids  = new Set(allFaqs.map(f => f.qid).filter(Boolean));
        const usedSlugs = new Set(allFaqs.map(f => f.slug).filter(Boolean));

        const toInsert = rows.map((row, index) => {
            // Determine QID
            let rawQid = row.Q_ID ? String(row.Q_ID).trim() : '';
            if (!rawQid) {
                rawQid = `Q-${Date.now()}-${index}`;
            }

            // Resolve QID conflicts (both within the batch and in the database)
            let qid = rawQid;
            if (usedQids.has(qid)) {
                let suffix = 2;
                while (usedQids.has(`${rawQid}-${suffix}`)) {
                    suffix += 1;
                }
                qid = `${rawQid}-${suffix}`;
            }
            usedQids.add(qid);

            // Determine Slug
            let rawSlug = row.Slug ? slugify(row.Slug) : slugify(row.Question_EN || row.Question || 'question');
            if (!rawSlug) {
                rawSlug = 'question';
            }

            // Resolve Slug conflicts (both within the batch and in the database)
            let slug = rawSlug;
            if (usedSlugs.has(slug)) {
                let suffix = 2;
                while (usedSlugs.has(`${rawSlug}-${suffix}`)) {
                    suffix += 1;
                }
                slug = `${rawSlug}-${suffix}`;
            }
            usedSlugs.add(slug);

            return {
                qid,
                slug,
                sessionNumber: row.Session || "0",
                timestamp:     row.Timestamp,

                // English (primary)
                question:           row.Question_EN   || row.Question || "",
                shortAnswer:        row.Short_Answer_EN || row.Short_Answer || "",
                fullAnswer:         row.Full_Answer_EN  || row.Full_Answer  || "",
                seoMetaTitle:       row.Meta_Title_EN  || row.Meta_Title   || "",
                seoMetaDescription: row.Meta_Desc_EN || row.Meta_Description_EN || row.Meta_Description || "",

                // Shared
                topic:         row.Topic || "General",
                subtopic:      row.Subtopic,
                keywords:      typeof row.Keywords === 'string'
                                   ? row.Keywords.split(',').map(k => k.trim()).filter(Boolean)
                                   : [],
                questionerName: row.Questioner_Name,
                location:       row.Location,

                // Translations
                translations: {
                    ur: {
                        question:           row.Question_UR    || "",
                        shortAnswer:        row.Short_Answer_UR || "",
                        fullAnswer:         row.Full_Answer_UR  || "",
                        seoMetaTitle:       row.Meta_Title_UR   || "",
                        seoMetaDescription: row.Meta_Desc_UR || row.Meta_Description_UR || "",
                    },
                    de: {
                        question:           row.Question_DE    || "",
                        shortAnswer:        row.Short_Answer_DE || "",
                        fullAnswer:         row.Full_Answer_DE  || "",
                        seoMetaTitle:       row.Meta_Title_DE   || "",
                        seoMetaDescription: row.Meta_Desc_DE || row.Meta_Description_DE || "",
                    },
                    es: {
                        question:           row.Question_ES    || "",
                        shortAnswer:        row.Short_Answer_ES || "",
                        fullAnswer:         row.Full_Answer_ES  || "",
                        seoMetaTitle:       row.Meta_Title_ES   || "",
                        seoMetaDescription: row.Meta_Desc_ES || row.Meta_Description_ES || "",
                    },
                    fr: {
                        question:           row.Question_FR    || "",
                        shortAnswer:        row.Short_Answer_FR || "",
                        fullAnswer:         row.Full_Answer_FR  || "",
                        seoMetaTitle:       row.Meta_Title_FR   || "",
                        seoMetaDescription: row.Meta_Desc_FR || row.Meta_Description_FR || "",
                    },
                },
            };
        });

        if (toInsert.length > 0) {
            await FAQ.insertMany(toInsert);
        }

        res.json({
            success:   true,
            processed: rows.length,
            inserted:  toInsert.length,
            skipped:   0,
            topicsCreated: createdTopics,
        });
    } catch (error) {
        console.error('Bulk upload error:', error);
        res.status(500).json({ message: 'Bulk upload failed' });
    }
};

module.exports = {
    getFAQs,
    getFAQBySlug,
    getTrendingFAQs,
    getFAQsByTopic,
    getFAQsBySession,
    getTopicsList,
    createFAQ,
    updateFAQ,
    deleteFAQ,
    bulkUploadFAQs
};
