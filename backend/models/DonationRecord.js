const mongoose = require('mongoose');


const DonationRecordSchema = new mongoose.Schema({
    donationRequest: {type: mongoose.Schema.Types.ObjectId, ref: "DonationRequest", required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    donatedAmount: {type: Number, required: true},
    date: {type: String, requires: true}
});

module.exports = mongoose.model('DonationRecord', DonationRecordSchema);