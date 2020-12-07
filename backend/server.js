//========require modules============================
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const duo_web = require('@duosecurity/duo_web');
const User = require( './models/User' );
const BankItem = require( './models/BankItem' );
require('dotenv').config();

const client = require('./plaidclient');
const donationProgress = require('./services/donationProgress');
const Agenda = require('agenda');
const DonationRequest = require('./models/DonationRequest');

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

//=========set up agenda jobs============================
const mongoConnectionString = 'mongodb://127.0.0.1/agenda';

const agenda = new Agenda({db: {address: mongo_uri}, collection: 'agendaJobs', processEvery: '1 minute'});



agenda.define('trigger progress re-calculation for all active donationRequests', async job => {
	console.log('EXECUTION OF trigger progress re-calculation for all active donationRequests');
	const activeDonationRequests = await DonationRequest.find({"status": "active"});
	for(activeDonationRequest of activeDonationRequests) {
		try {
			await donationProgress.triggerDonationProgressCalculaton(activeDonationRequest);
		} catch (err) {
			//TODO: log the error approriately
			console.log(err);
		}
	}
});

(async function() {
  await agenda.start();
  await agenda.every('30 minute', 'trigger progress re-calculation for all active donationRequests');
})();


//============app routes============================
app.use('/images/', require("./routes/images"));
app.use('/donation-request/', require('./routes/donation-request'));
app.use('/user/', require("./routes/user"));
app.use('/banks/', require("./routes/banks"));
app.use('/stripe/', require("./routes/stripe"));
app.use('/donation-record/', require('./routes/donation-record'));
app.use('/plaidwebhooks/', require("./routes/plaidwebhooks"));
app.use('/transactions/', require("./routes/transactions"));


app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
		return res.status(500).json({error: 'Issue with Passport authentication1'});
	}
    if (!user) {
		return res.status(403).json({error: 'The login information entered is not correct. Please try again'});
	}
	if (user.mfaEnabled) {
		sig_request = duo_web.sign_request(process.env.DUO_INTEGRATION_KEY, process.env.DUO_SECRET_KEY, process.env.DUO_APPLICATION_KEY, user.username);
		return res.status(200).json({mfa: sig_request})
	}
    req.logIn(user, function(err) {
      if (err) {
		return res.status(500).json({error: 'Issue with Passport authentication2'});
	  }
	  	//console.log(req.user.stripeAccountId);
		return res.json({success: 'Successfully logged in user'});
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
			last: req.body.lastname,
			role: req.body.role
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
						req.logIn(user, function(err) {
							if (err) {
							  return res.status(500).json({error: 'Issue with Passport authentication'});
							}
							return res.json({success: 'Successfully created user'});
						});
					}
				})
			}
		})

	}
});

app.post('/mfaverify', (req, res, next) => {
	var username = duo_web.verify_response(process.env.DUO_INTEGRATION_KEY, process.env.DUO_SECRET_KEY, process.env.DUO_APPLICATION_KEY, req.body.sig_response);
	if (!username) {
		return res.status(403).json({error: 'The login information could not be verified. Please try again'});
	} else {
		User.findOne({ username: username }).then(user => {
			if (user) {
				req.logIn(user, function(err) {
					if (err) {
					  return res.status(500).json({error: 'Issue with Passport authentication2'});
					}
					  return res.json({success: 'Successfully logged in user'})
				});
			} else {
				return res.status(500).json({error: 'Issue with Passport authentication.'})
			}
		});
	}
})

app.get('/logout', (req, res, next) => {
	req.logOut();
	res.json({success: "Successfully logged out"});
})

// START: UTILITY ENDPOINTS USED FOR SANDBOX TESTING PURPOSES

// sandbox DEFAULT_UPDATE webhook invocation from Plaid for all items on file
app.get('/trigger-webhook', async (req, res, next) => {
	const bankItems = await BankItem.find({});
	for (const bankItem of bankItems) {
		const response = client.sandboxItemFireWebhook(bankItem.accessToken, 'DEFAULT_UPDATE').then(() => {
			return res.status(201).json({});
		}).catch((err) => {
			console.log(err);
			return res.status(500).json({});
		});
	}
});


// sandbox DEFAULT_UPDATE webhook invocation from Plaid for specific itemid
app.get('/trigger-webhook/:itemid', (req, res, next) => {
	BankItem.findOne( {_id: req.params.itemid} ).then(bankItem => {
		const response = client.sandboxItemFireWebhook(bankItem.accessToken, 'DEFAULT_UPDATE').then(() => {
			return res.status(201).json({});
		}).catch((err) => {
			console.log(err);
			return res.status(500).json({});
		})
	});
});

// Instruct Plaid to switch the webhook endpoint fo all bankitems on file to point to the payforwardapp.com server
app.get('/switch-webhooks', async (req, res, next) => {
	const bankItems = await BankItem.find({});
	for (const bankItem of bankItems) {
		await client
		.updateItemWebhook(bankItem.accessToken, 'https://payforwardapp.com/plaidwebhooks/')
		.catch((err) => {
			console.log(err);
		});
	}
});
// END: UTILITY ENDPOINTS USED FOR SANDBOX TESTING PURPOSES


app.listen(4000, () => {
	console.log('Server listening on port 4000.')
});
