const mongoose = require('mongoose');

<<<<<<< HEAD
const BankAccountSchema = new mongoose.Schema({
	account_id: {type: Object, required: true},
	name: {type: String, require: true},
	official_name: {type: String, require: true},
	type: {type: String, require: true},
	subtype: {type: String, require: true}
});


=======
>>>>>>> 4a150ab88dce54decaaa554455c2cf9d2da35437
const BankItemSchema = new mongoose.Schema({
	user_id: {type: Object, required: true},
	itemId: {type: String, required: true},
	accessToken: {type: String, required: true},
<<<<<<< HEAD
	institutionName: {type: String, required: true},
	bank_accounts: [BankAccountSchema]
=======
	institutionName: {type: String, required: true}
>>>>>>> 4a150ab88dce54decaaa554455c2cf9d2da35437
});

module.exports = mongoose.model('BankItem', BankItemSchema);