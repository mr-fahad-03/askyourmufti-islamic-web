const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/faqController');

router.route('/').get(getFAQs).post(createFAQ);
router.route('/bulk').post(bulkUploadFAQs);
router.route('/trending').get(getTrendingFAQs);
router.route('/topics-list').get(getTopicsList);
router.route('/topic/:topic').get(getFAQsByTopic);
router.route('/session/:sessionNumber').get(getFAQsBySession);
router.route('/slug/:slug').get(getFAQBySlug);
router.route('/:id').put(updateFAQ).delete(deleteFAQ);

module.exports = router;
