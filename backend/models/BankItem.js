const mongoose = require('mongoose');

const BankItemSchema = new mongoose.Schema({
	user_id: {type: Object, required: true},
	itemId: {type: String, required: true},
	accessToken: {type: String, required: true},
	institutionName: {type: String, required: true}
});

module.exports = mongoose.model('BankItem', BankItemSchema);