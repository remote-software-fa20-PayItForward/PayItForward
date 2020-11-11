//========require modules============================
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const plaid = require('plaid');
const duo_web = require('@duosecurity/duo_web');
const moment = require('moment');
const User = require( './models/User' );
const BankItem = require( './models/BankItem' );
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
	if (user.mfaEnabled) {
		sig_request = duo_web.sign_request(process.env.DUO_INTEGRATION_KEY, process.env.DUO_SECRET_KEY, process.env.DUO_APPLICATION_KEY, user.username);
		return res.status(200).json({mfa: sig_request})
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

app.get('/user', (req, res, next) => {
	console.log(req.user);
	if (req.user) {
		return res.json(req.user);
	} else {
		return res.json({});
	}
})

app.post('/UserPage', (req, res, next) => {
	User.updateOne({username: req.user.username}, {bio: req.body.bio}).then(bio => {
		if(bio) {
			return res.json({Success: 'Successfully updated bio'})
		} else {
			return res.status(500).json({error: 'Issue updating bio'})
		}
	})
})

app.get('/logout', (req, res, next) => {
	req.logOut();
	res.json({success: "Successfully logged out"});
})


app.get('/linked-banks', async (req, res, next) => {
	console.log(req.user);
	
	//await BankItem.deleteMany({});

	if (req.user) {
		const bankItems = await BankItem.find({user_id: req.user._id});
		console.log(bankItems);
		const bankItemsResponse = bankItems.map(bankItem => {
			return {bankId: bankItem._id, bankName: bankItem.institutionName}
		});
		console.log(bankItemsResponse)

		res.json({bankItems: bankItemsResponse});
	} else {
		return res.status(401).json({error: 'You are not authenticated.'});
	}
});

app.get('/obtain-plaid-link-token', async (req, res, next) => {
	console.log(req.user);
	if (req.user) {
		const response = await client.createLinkToken({
			user: {
				client_user_id: req.user._id
			},
			client_name: 'PayItForward App',
			products: ['auth', 'transactions'],
			country_codes: ['US'],
			language: 'en'
		})
		.catch((err) => {
			console.log(err);
		});

		res.json(response);
	} else {
		return res.status(401).json({error: 'You are not authenticated.'});
	}
});

app.post('/link-bank-account', async (req, res, next) => {
	console.log(req.body);

	if (req.user) {
		console.log(req.user);

		let plaidClientErrored = false;
		const tokenResponse = await client.exchangePublicToken(req.body.public_link_token).catch((err) => {
			console.log(err);
			plaidClientErrored = true;
			
		});
		if (plaidClientErrored) {
			return res.status(500).json({error: 'Error creating BankItem. Please try again'});
		}

		console.log(tokenResponse);
		const accessToken = tokenResponse.access_token;
		const itemId = tokenResponse.item_id;

		const itemResponse = await client.getItem(accessToken).catch((err) => {
			console.log(err);
			plaidClientErrored = true;
			
		});
		if (plaidClientErrored) {
			return res.status(500).json({error: 'Error creating BankItem. Please try again'});
		}

		const institutionResponse = await client.getInstitutionById(itemResponse.item.institution_id, ['US']).catch((err) => {
			console.log(err);
			plaidClientErrored = true;
			
		});
		if (plaidClientErrored) {
			return res.status(500).json({error: 'Error creating BankItem. Please try again'});
		}

		console.log(institutionResponse);
		console.log(await BankItem.find({}));
		
		return BankItem.findOne({ user_id: req.user._id, institutionName: institutionResponse.institution.name }).then(bankItem => {
			if (bankItem) {
				console.log(bankItem);
				// check if the item is already within the DB
				return res.status(409).json({error: 'This Bank has been added already.'})
			} else {
				// if the item is not aleady stored within the DB, then persist it alongiste it's accessToken
				BankItem.create({user_id: req.user._id, itemId: itemId, accessToken: accessToken, institutionName: institutionResponse.institution.name}, function(err, bankItem) {
					if (err) {
						console.log(err);
						return res.status(500).json({error: 'Error creating BankItem. Please try again'});
					} else {
						console.log('bankItem', bankItem);
						console.log('Successfully created BankItem');
						return res.json({success: 'Successfully created BankItem'});
					}
				});
			}
		});

	} else {
		return res.status(401).json({error: 'You are not authenticated.'});
	}
});


app.get('/banks/:bankId/accounts', async (req, res, next) => {
	console.log(req.params.bankId);
	if (req.user) {
		plaidClientErrored = false;
		const matchingBankItem = await BankItem.findOne({_id: req.params.bankId, user_id: req.user._id}).catch((err) => {
			console.log(err);
			plaidClientErrored = true;
			
		});
		if (plaidClientErrored) {
			return res.status(500).json({error: 'There has been an error obtaining the list accounts within this bank. Please try again later.'});
		}
		console.log(matchingBankItem);

		const bankAccounts = await client.getAccounts(matchingBankItem.accessToken).catch((err) => {
			console.log(err);
			plaidClientErrored = true;
		});
		if (plaidClientErrored) {
			return res.status(500).json({error: 'There has been an error obtaining the list accounts within this bank. Please try again later.'});
		}

		console.log(bankAccounts);

		res.json({bankAccounts: bankAccounts});
	} else {
		return res.status(401).json({error: 'You are not authenticated.'});
	}
});

app.get('/banks/:bankId/accounts/:accountId/transactions', async (req, res, next) => {

	if (req.user) {
		plaidClientErrored = false;
		const matchingBankItem = await BankItem.findOne({_id: req.params.bankId, user_id: req.user._id}).catch((err) => {
			console.log(err);
			plaidClientErrored = true;
			
		});
		if (plaidClientErrored) {
			return res.status(500).json({error: 'There has been an error obtaining the transactions. Please try again later.'});
		}
		console.log(matchingBankItem);

		const bankAccounts = await client.getAccounts(matchingBankItem.accessToken).catch((err) => {
			console.log(err);
			plaidClientErrored = true;
		});
		if (plaidClientErrored) {
			return res.status(500).json({error: 'There has been an error obtaining the transactions. Please try again later.'});
		}
		console.log(bankAccounts);
		req.params.accountId

		const matchingBankAccount = bankAccounts.accounts.find((bankAccount) => {return bankAccount.account_id == req.params.accountId});
		console.log(matchingBankAccount);
		if (!matchingBankAccount) {
			return res.status(409).json({error: 'Unable to find the bank account.'});
		}

		const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
  		const endDate = moment().format('YYYY-MM-DD');
		const transactionsResponse = await client.getTransactions(matchingBankItem.accessToken, startDate, endDate, {account_ids: [req.params.accountId],count: 500, offset: 0,}).catch((err) => {
			console.log(err);
			plaidClientErrored = true;
		});
		if (plaidClientErrored) {
			return res.status(500).json({error: 'There has been an error obtaining the transactions. Please try again later.'});
		}

		console.log(transactionsResponse)

		res.json({transactions: transactionsResponse});
	} else {
		return res.status(401).json({error: 'You are not authenticated.'});
	}
});

app.listen(4000, () => {
	console.log('Server listening on port 4000.')
}); 
