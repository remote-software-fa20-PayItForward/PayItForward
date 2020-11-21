const mongoose = require('mongoose');

const DonationRequestSchema = new mongoose.Schema({
    name: {type: String, required: true},
    image: {type: String},
    description: {type: String, required: true},
    category: {type: String, required: true, enum: ["groceries", "gas", "books"]},
    amount: {type: Number, required: true},
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User"}
});

module.exports = mongoose.model('DonationRequest', DonationRequestSchema);