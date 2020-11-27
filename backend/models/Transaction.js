const mongoose = require('mongoose');


const TransactionSchema = new mongoose.Schema({
    transaction_id: {type: String, required: true},
    userId: {type: String, required: true},
    bankItemId: {type: String, required: true},
	bankAccountId: {type: String, required: true},
    name: {type: String, required: true},
    merchant_name: {type: String, required: false},
	categories: [String],
    transaction_type: {type: String, required: true},
    amount: {type: Number, requires: true},
    date: {type: String, requires: true},
    isMarkedForDeletion: {type: Boolean, requires: true, default: false}
});

module.exports = mongoose.model('Transaction', TransactionSchema);