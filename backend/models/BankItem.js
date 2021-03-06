const mongoose = require('mongoose');

const BankAccountSchema = new mongoose.Schema({
	account_id: {type: String, required: true},
	mask: {type: String},
	name: {type: String, required: true},
	official_name: {type: String, required: true},
	type: {type: String, required: true},
	subtype: {type: String, required: true}
});


const BankItemSchema = new mongoose.Schema({
	user_id: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
	itemId: {type: String, required: true},
	accessToken: {type: String, required: true},
	institutionName: {type: String, required: true},
	bank_accounts: [BankAccountSchema]
});

module.exports = mongoose.model('BankItem', BankItemSchema);
