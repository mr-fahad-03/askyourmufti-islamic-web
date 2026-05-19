const express = require('express');
const router = express.Router();
const { getSessions, createSession, updateSession, deleteSession } = require('../controllers/sessionController');

router.route('/').get(getSessions).post(createSession);
router.route('/:id').put(updateSession).delete(deleteSession);

module.exports = router;
