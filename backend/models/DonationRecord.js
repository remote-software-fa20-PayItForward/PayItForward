const mongoose = require('mongoose');


const DonationRecordSchema = new mongoose.Schema({
    donationRequest: {type: mongoose.Schema.Types.ObjectId, ref: "DonationRequest", required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    donatedAmount: {type: Number, required: true},
    date: {type: String, required: true},
    completed: {type: Boolean, default: false}
});

module.exports = mongoose.model('DonationRecord', DonationRecordSchema);
