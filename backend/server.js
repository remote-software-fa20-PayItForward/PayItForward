//========require modules============================
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
require( './db' );
require('dotenv').config();

//=========set up app================================
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongo_uri = process.env.MONGODB_KEY;
mongoose.connect(mongo_uri, {useUnifiedTopology:true, useNewUrlParser:true})
	.then((resolved) => console.log('The database has been successfully connected! :D'))
	.catch((err) => console.log(err));
	
const User = mongoose.model('User');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) { //store username in passport
	done(null, user.username);
});
passport.deserializeUser(function(userId, done) { //fetch user from database using username
	User.findById(username, (err, user) => done(err, user));
});
//local authentication strategy:
//		* check if user is in database
//		* check if hash of submitted password matches stored hash
//		* call done or false 
const local = new LocalStrategy((username, password, done) => {
	User.findOne( {username} )
		.then(user => {
			if (!user || !user.validPassword(password)) {
				done(null, false);
			} else {
				done(null, user);	
			}
		})
		.catch(e => done(e));
});
passport.use('local', local);

//============app routes============================
app.get('/', (req, res, next) => {
    res.send('Hello, world!');
});

app.post('/login', (req, res, next) => {
	
});

app.post('/register', (req, res, next) => {
	if (req.body.password !== req.body.passwordconfirm) {
		res.status(500).send('The passwords entered are not the same');
	} else {
		const newUser = {
			username: req.body.email,
			password: req.body.password,
			first: req.body.firstname,
			last: req.body.lastname
		}
		console.log(newUser);
		User.create(newUser, function(err, user) {
			if (err) {
				console.log(err);
				res.status(500).send('Error creating user. Please try again');
			} else {
				console.log('user', user);
				console.log('Successfully created user');
				res.status(200).send('Successfully created user');
			}
		})
	}
});

app.listen(4000, () => {
	console.log('Server listening on port 4000.')
}); 
