const express = require('express');
const router = express.Router();
const {
    getDonations,
    getAllDonations,
    getDonationById,
    createDonation,
    updateDonation,
    deleteDonation,
} = require('../controllers/donationController');

// Public: get active donation accounts
router.get('/', getDonations);

// Admin: get all donation accounts (including inactive)
router.get('/all', getAllDonations);

// Admin: get single
router.get('/:id', getDonationById);

// Admin: create
router.post('/', createDonation);

// Admin: update
router.put('/:id', updateDonation);

// Admin: delete
router.delete('/:id', deleteDonation);

module.exports = router;
