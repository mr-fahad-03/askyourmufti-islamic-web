const Donation = require('../models/Donation');

// @desc    Get all active donation accounts (public)
// @route   GET /api/donations
// @access  Public
const getDonations = async (req, res) => {
    try {
        const donations = await Donation.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all donation accounts (admin - includes inactive)
// @route   GET /api/donations/all
// @access  Private/Admin
const getAllDonations = async (req, res) => {
    try {
        const donations = await Donation.find({}).sort({ createdAt: -1 });
        res.json(donations);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single donation account
// @route   GET /api/donations/:id
// @access  Private/Admin
const getDonationById = async (req, res) => {
    try {
        const donation = await Donation.findById(req.params.id);
        if (!donation) {
            return res.status(404).json({ message: 'Donation account not found' });
        }
        res.json(donation);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create a donation account
// @route   POST /api/donations
// @access  Private/Admin
const createDonation = async (req, res) => {
    try {
        const donation = await Donation.create(req.body);
        res.status(201).json(donation);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
};

// @desc    Update a donation account
// @route   PUT /api/donations/:id
// @access  Private/Admin
const updateDonation = async (req, res) => {
    try {
        const donation = await Donation.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!donation) {
            return res.status(404).json({ message: 'Donation account not found' });
        }
        res.json(donation);
    } catch (error) {
        res.status(400).json({ message: 'Invalid data', error: error.message });
    }
};

// @desc    Delete a donation account
// @route   DELETE /api/donations/:id
// @access  Private/Admin
const deleteDonation = async (req, res) => {
    try {
        const donation = await Donation.findByIdAndDelete(req.params.id);
        if (!donation) {
            return res.status(404).json({ message: 'Donation account not found' });
        }
        res.json({ message: 'Donation account removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getDonations,
    getAllDonations,
    getDonationById,
    createDonation,
    updateDonation,
    deleteDonation,
};
