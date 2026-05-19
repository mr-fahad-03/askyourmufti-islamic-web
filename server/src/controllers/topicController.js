const Topic = require('../models/Topic');
const FAQ = require('../models/FAQ');

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

const syncMissingTopicsFromFAQs = async () => {
    const distinctTopics = await FAQ.distinct('topic', { topic: { $exists: true, $ne: null } });
    const normalizedTopics = distinctTopics
        .map((t) => normalizeTopicName(t))
        .filter(Boolean);

    if (normalizedTopics.length === 0) return 0;

    const existingTopics = await Topic.find({}).select('name slug').lean();
    const existingNameSet = new Set(existingTopics.map((t) => String(t.name || '').toLowerCase()));
    const usedSlugs = new Set(existingTopics.map((t) => String(t.slug || '').toLowerCase()).filter(Boolean));

    const toCreate = [];
    normalizedTopics.forEach((name) => {
        const lower = name.toLowerCase();
        if (existingNameSet.has(lower)) return;

        toCreate.push({
            name,
            slug: buildUniqueSlug(slugify(name), usedSlugs),
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
            return Array.isArray(error.insertedDocs) ? error.insertedDocs.length : 0;
        }
        throw error;
    }
};

// @desc    Get all topics
// @route   GET /api/topics
// @access  Public
const getTopics = async (req, res) => {
    try {
        await syncMissingTopicsFromFAQs();
        const topics = await Topic.find({}).sort({ name: 1 });
        res.json(topics);
    } catch (error) {
        console.error('Failed to fetch/sync topics:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a topic
// @route   POST /api/topics
// @access  Private/Admin
const createTopic = async (req, res) => {
    try {
        const existing = await Topic.findOne({ slug: req.body.slug });
        if (existing) {
            return res.status(400).json({ message: 'Topic slug already exists' });
        }

        const topic = await Topic.create(req.body);
        res.status(201).json(topic);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

// @desc    Update a topic
// @route   PUT /api/topics/:id
// @access  Private/Admin
const updateTopic = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        const { name, slug } = req.body;

        if (slug) {
            const existingSlug = await Topic.findOne({ slug, _id: { $ne: req.params.id } });
            if (existingSlug) {
                return res.status(400).json({ message: 'Topic slug already exists' });
            }
        }

        if (name) {
            const existingName = await Topic.findOne({ name, _id: { $ne: req.params.id } });
            if (existingName) {
                return res.status(400).json({ message: 'Topic name already exists' });
            }
        }

        const updated = await Topic.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updated);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

// @desc    Delete a topic
// @route   DELETE /api/topics/:id
// @access  Private/Admin
const deleteTopic = async (req, res) => {
    try {
        const topic = await Topic.findById(req.params.id);
        if (!topic) {
            return res.status(404).json({ message: 'Topic not found' });
        }

        await Topic.findByIdAndDelete(req.params.id);
        res.json({ message: 'Topic deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getTopics,
    createTopic,
    updateTopic,
    deleteTopic
};
