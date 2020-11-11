const mongoose = require('mongoose');
//hashes passwords
const bcrypt = require('bcrypt');
//adds validation for unique fields in schema
const uniqueValidator = require('mongoose-unique-validator');

const saltRounds = 10;

const UserSchema = new mongoose.Schema({
	username: {type: String, required: true, unique: true},
	passwordHash: {type: String, required: true},
	first: {type: String, required: true},
	last: {type: String, required: true},
	mfaEnabled: {type: Boolean, default: false},
	bio: {type: String, required: false},
	privacy: {type: Boolean, default: false, required: false}
});

//apply uniqueValidator to UserSchema
UserSchema.plugin(uniqueValidator);
//hash & salt password in UserSchema: https://gist.github.com/thebopshoobop/f5ecc254c2ac92611e792d169a78ff3f
UserSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.passwordHash);
};
UserSchema.virtual("password").set(function(value) {
	this.passwordHash = bcrypt.hashSync(value, saltRounds);
});

mongoose.model('User', UserSchema);

const BankItemSchema = new mongoose.Schema({
	user_id: {type: Object, required: true},
	itemId: {type: String, required: true},
	accessToken: {type: String, required: true},
	institutionName: {type: String, required: true}
});

mongoose.model('BankItem', BankItemSchema);