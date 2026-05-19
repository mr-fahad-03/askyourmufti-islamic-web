const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema(
    {
        bankName: { type: String, required: true },
        accountHolder: { type: String, required: true },
        accountNumber: { type: String, required: true },
        iban: { type: String },
        swiftBic: { type: String },
        branchName: { type: String },
        branchCode: { type: String },
        currency: { type: String, default: 'EUR' },
        country: { type: String, default: 'Germany' },
        purpose: { type: String, default: 'Donation for Islamic Education' },
        notes: { type: String },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Donation', DonationSchema);
