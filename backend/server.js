//========require modules============================
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const plaid = require('plaid');
require( './db' );
require('dotenv').config();

//=========set up app================================
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({secret: process.env.SESSION_SECRET}));

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

//setup plaid
const plaid_id = process.env.PLAID_CLIENT_ID;
const plaid_secret = process.env.PLAID_SECRET;
const plaid_env = plaid.environments.sandbox;

const client = new plaid.Client({
	clientID: plaid_id,
	secret: plaid_secret,
	env: plaid_env
});

//============app routes============================
/*
app.get('/', (req, res, next) => {
    res.send('Hello, world!');
});
*/

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
		return res.status(500).json({error: 'Issue with Passport authentication1'});
	}
    if (!user) {
		return res.status(403).json({error: 'The login information entered is not correct. Please try again'});
	}
    req.logIn(user, function(err) {
      if (err) { 
		return res.status(500).json({error: 'Issue with Passport authentication2'});
	  }
		return res.json({success: 'Successfully logged in user'})
    });
  })(req, res, next);
});

app.post('/register', (req, res, next) => {
	if (req.body.password !== req.body.passwordconfirm) {
		return res.status(400).json({error: 'The passwords entered are not the same'});
	} else {
		const newUser = {
			username: req.body.email,
			password: req.body.password,
			first: req.body.firstname,
			last: req.body.lastname
		}
		console.log(newUser);
		User.findOne({ username: req.body.email }).then(user => {
			if (user) {
				return res.status(400).json({error: 'An account already exists with that email. Please use a different email.'})
			} else {
				User.create(newUser, function(err, user) {
					if (err) {
						console.log(err);
						return res.status(500).json({error: 'Error creating user. Please try again'});
					} else {
						console.log('user', user);
						console.log('Successfully created user');
						return res.json({success: 'Successfully created user'});
					}
				})
			}
		})

	}
});


app.get('/user', (req, res, next) => {
	console.log(req.user);
	if (req.user) {
		return res.json(req.user);
	} else {
		return res.json({});
	}
})

app.get('/logout', (req, res, next) => {
	req.logOut();
	res.json({success: "Successfully logged out"});
})

app.listen(4000, () => {
	console.log('Server listening on port 4000.')
}); 
