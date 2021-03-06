const mongoose = require('mongoose');

const DonationRequestSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String},
    description: {type: String, required: true},
    category: {type: String, required: true, enum: ["groceries", "gas", "books"]},
    amount: {type: Number, required: true},
    amountCollected: {type: Number, required: true, default: 0},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    subscribers: {type:Array , "default":[]},
    status: {type: String, required: true, enum: ["active", "completed", "cancelled"]},
    alerted: {type: Boolean, default: false}
});

module.exports = mongoose.model('DonationRequest', DonationRequestSchema);
