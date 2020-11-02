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

//=========set up mongodb================================
const mongo_uri = process.env.MONGODB_KEY;
mongoose.connect(mongo_uri, {useUnifiedTopology:true, useNewUrlParser:true})
	.then((resolved) => console.log('The database has been successfully connected! :D'))
	.catch((err) => console.log(err));
	
const User = mongoose.model('User');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//=========set up passport auth============================
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) { //store user id in passport
	done(null, user._id);
});
passport.deserializeUser(function(userId, done) { //fetch user from database using id
	User.findById(userId, (err, user) => done(err, user));
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

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
		res.statusMessage = 'Issue with Passport authentication1';
		res.status(500).end();
	}
    if (!user) { 
		res.statusMessage = 'Issue with Passport authentication2';
		res.status(500).end();
	}
    req.logIn(user, function(err) {
      if (err) { 
	  	res.statusMessage = 'The login information entered is not correct. Please try again';
		res.status(401).end();
	  }
      	res.statusMessage = 'Successfully logged in user';
		res.status(200).end()
    });
  })(req, res, next);
});

app.post('/register', (req, res, next) => {
	if (req.body.password !== req.body.passwordconfirm) {
		res.statusMessage = 'The passwords entered are not the same';
		res.status(500).end();
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
				res.statusMessage = 'Error creating user. Please try again';
				res.status(501).end();
			} else {
				console.log('user', user);
				console.log('Successfully created user');
				res.statusMessage = 'Successfully created user';
				res.status(200).end();
			}
		})
	}
});

app.listen(4000, () => {
	console.log('Server listening on port 4000.')
}); 
