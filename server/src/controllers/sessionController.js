const Session = require('../models/Session');
const SUPPORTED_LANGS = ['en', 'ur', 'de', 'fr', 'es'];

const resolveLang = (lang) => {
    if (!lang || typeof lang !== 'string') return 'en';
    const normalized = lang.toLowerCase();
    return SUPPORTED_LANGS.includes(normalized) ? normalized : 'en';
};

const localizeSession = (session, lang) => {
    const item = session.toObject ? session.toObject() : session;
    if (lang === 'en') return item;

    const t = (item.translations && item.translations[lang]) || {};
    return {
        ...item,
        title: t.title || item.title,
        description: t.description || item.description,
    };
};

// @desc    Get all sessions
// @route   GET /api/sessions
// @access  Public
const getSessions = async (req, res) => {
    try {
        const lang = resolveLang(req.query.lang);
        const sessions = await Session.find({}).sort({ dateRecorded: -1 });
        res.json(sessions.map((session) => localizeSession(session, lang)));
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a session
// @route   POST /api/sessions
// @access  Private/Admin
const createSession = async (req, res) => {
    try {
        const session = await Session.create(req.body);
        res.status(201).json(session);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

// @desc    Update a session
// @route   PUT /api/sessions/:id
// @access  Private/Admin
const updateSession = async (req, res) => {
    try {
        const session = await Session.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.json(session);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data' });
    }
};

// @desc    Delete a session
// @route   DELETE /api/sessions/:id
// @access  Private/Admin
const deleteSession = async (req, res) => {
    try {
        const session = await Session.findByIdAndDelete(req.params.id);
        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }
        res.json({ message: 'Session deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getSessions,
    createSession,
    updateSession,
    deleteSession
};
