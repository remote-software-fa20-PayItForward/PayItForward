const mongoose = require('mongoose');

const BankAccountSchema = new mongoose.Schema({
	account_id: {type: Object, required: true},
	name: {type: String, require: true},
	official_name: {type: String, require: true},
	type: {type: String, require: true},
	subtype: {type: String, require: true}
});


const BankItemSchema = new mongoose.Schema({
	user_id: {type: Object, required: true},
	itemId: {type: String, required: true},
	accessToken: {type: String, required: true},
	institutionName: {type: String, required: true},
	bank_accounts: [BankAccountSchema]
});

module.exports = mongoose.model('BankItem', BankItemSchema);