const mongoose = require('mongoose');
//hashes passwords
const bcrypt = require('bcrypt');
//adds validation for unique fields in schema
const uniqueValidator = require('mongoose-unique-validator');
require('dotenv').config();

const saltRounds = 10;
const mongo_uri = process.env.MONGODB_KEY;

const UserSchema = new mongoose.Schema({
	username: {type: String, required: true, unique: true},
	passwordHash: {type: String, required: true},
	first: {type: String, required: true},
	last: {type: String, required: true},
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

mongoose.connect(mongo_uri, {useUnifiedTopology:true, useNewUrlParser:true})
	.then((resolved) => console.log('The database has been successfully connected! :D'))
	.catch((err) => console.log(err));