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
const multer = require('multer');
const User = require( './models/User' );
const BankItem = require( './models/BankItem' );
const Image = require( './models/Image' );
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bcrypt = require('bcrypt');
const saltRounds = 10;

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

app.use('/images/', require("./routes/images"));
app.use('/donation-request/', require('./routes/donation-request'));
app.use('/user/', require("./routes/user"));

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

app.get('/logout', (req, res, next) => {
	req.logOut();
	res.json({success: "Successfully logged out"});
})


app.get('/linked-banks', async (req, res, next) => {
	
	//await BankItem.deleteMany({});

	if (req.user) {
		const bankItems = await BankItem.find({user_id: req.user._id});
		const bankItemsResponse = bankItems.map(bankItem => {
			return {bankId: bankItem._id, bankName: bankItem.institutionName, bankAccounts: bankItem.bank_accounts}
		});

		res.json({bankItems: bankItemsResponse, firstname: req.user.first});
	} else {
		return res.status(401).json({error: 'You are not authenticated.'});
	}
});

app.get('/linked-bank-accounts', async (req, res, next) => {

	if (req.user) {
		const bankItems = await BankItem.find({user_id: req.user._id});

		const bankAccountsResponse = [];

		for(const bankItem of bankItems) {
			for(const bankAccount of bankItem.bank_accounts) {
				bankAccountsResponse.push({
					bankId: bankItem._id,
					bankName: bankItem.institutionName,
					account_id: bankAccount.account_id,
					name: bankAccount.name,
					official_name: bankAccount.official_name,
					type: bankAccount.type,
					subtype: bankAccount.subtype
				});
			}
		}

		res.json({bankAccounts: bankAccountsResponse});
	} else {
		return res.status(401).json({error: 'You are not authenticated.'});
	}
});

app.get('/obtain-plaid-link-token', async (req, res, next) => {
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

app.post('/link-bank', async (req, res, next) => {

	if (req.user) {

		let plaidClientErrored = false;
		const tokenResponse = await client.exchangePublicToken(req.body.public_link_token).catch((err) => {
			console.log(err);
			plaidClientErrored = true;
			
		});
		if (plaidClientErrored) {
			return res.status(500).json({error: 'Error creating BankItem. Please try again'});
		}

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
		
		return BankItem.findOne({ user_id: req.user._id, institutionName: institutionResponse.institution.name }).then(bankItem => {
			// check if the item is already within the DB
			if (bankItem) {
				return res.status(409).json({error: 'This Bank has been added already.'})
			} else {
				// if the item is not aleady stored within the DB, then persist it with its accessToken
				BankItem.create({user_id: req.user._id, itemId: itemId, accessToken: accessToken, institutionName: institutionResponse.institution.name}, function(err, bankItem) {
					if (err) {
						console.log(err);
						return res.status(500).json({error: 'Error creating BankItem. Please try again'});
					} else {
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


app.post('/banks/:bankId/link-bank-accounts', async (req, res, next) => {

	if (req.user) {

		let plaidClientErrored = false;
		let dbError = false;
		const matchingBankItem = await BankItem.findOne({_id: req.params.bankId, user_id: req.user._id}).catch((err) => {
			dbError = true;
		});
		if (dbError) {
			return res.status(500).json({error: 'There has been an error saving the selected list of bank account for this bank. Please try again later.'});
		
		
		}


		const bank_accounts_to_persist = [];

		if (req.body.selectedBankAccountIds != null && req.body.selectedBankAccountIds.length > 0 ) {
			const bankAccounts = await client.getAccounts(matchingBankItem.accessToken).catch((err) => {
				console.log(err);
				plaidClientErrored = true;
			});
			if (plaidClientErrored) {
				return res.status(500).json({error: 'There has been an error obtaining the list accounts within this bank. Please try again later.'});
			}

			for (const bankAccount of bankAccounts['accounts']) {
				if (req.body.selectedBankAccountIds.includes(bankAccount.account_id)) {
					bank_accounts_to_persist.push({
						account_id: bankAccount.account_id,
						name: bankAccount.name,
						official_name: bankAccount.official_name,
						type: bankAccount.type,
						subtype: bankAccount.subtype,
					});
				}
			}
		}

		matchingBankItem.bank_accounts = bank_accounts_to_persist;
		let ala = await matchingBankItem.save();
	} else {
		return res.status(401).json({error: 'You are not authenticated.'});
	}

	return res.status(201).json({});
});

app.get('/banks/:bankId/accounts', async (req, res, next) => {
	if (req.user) {
		plaidClientErrored = false;
		const matchingBankItem = await BankItem.findOne({_id: req.params.bankId, user_id: req.user._id}).catch((err) => {
			console.log(err);
			plaidClientErrored = true;
			
		});
		if (plaidClientErrored) {
			return res.status(500).json({error: 'There has been an error obtaining the list accounts within this bank. Please try again later.'});
		}

		const bankAccounts = await client.getAccounts(matchingBankItem.accessToken).catch((err) => {
			console.log(err);
			plaidClientErrored = true;
		});
		if (plaidClientErrored) {
			return res.status(500).json({error: 'There has been an error obtaining the list accounts within this bank. Please try again later.'});
		}

		/*const bankAccountsResponse = [];
		for (bankAccount of bankAccounts['accounts']) {
			if ()bankAccount.account_id)
		}
		*/

		res.json({
			bankAccounts: bankAccounts['accounts'],
			bankItem: matchingBankItem
		});
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

		const bankAccounts = await client.getAccounts(matchingBankItem.accessToken).catch((err) => {
			console.log(err);
			plaidClientErrored = true;
		});
		if (plaidClientErrored) {
			return res.status(500).json({error: 'There has been an error obtaining the transactions. Please try again later.'});
		}

		const matchingBankAccount = bankAccounts.accounts.find((bankAccount) => {return bankAccount.account_id == req.params.accountId});
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

		res.json({transactions: transactionsResponse});
	} else {
		return res.status(401).json({error: 'You are not authenticated.'});
	}
});

app.post("/create-payment-intent", async (req, res) => {
	//const { items } = req.body;
	// Create a PaymentIntent with the order amount and currency
	const paymentIntent = await stripe.paymentIntents.create({
	    payment_method_types: ['card'],
		amount: 1000,
		currency: 'usd',
		application_fee_amount: 1000*0.029+30,
		transfer_data: {
		destination:'acct_1HqWTpQLXrRrQtsS',
  },
	});
	res.send({
	  clientSecret: paymentIntent.client_secret
	});
});


app.post("/onboard-user", async (req, res) => {
	try {
	  const user = await User.findById(req.user._id).exec();
	  var account;
	  if (user.hasStripeAccount) {
		account = await stripe.accounts.retrieve(user.stripeAccountId);
	  } else {
		account = await stripe.accounts.create({type: "express"});
		console.log('stripe account id: ' + account.id)
		req.session.accountID = account.id;
		console.log('req session: '+req.session.accountID);
		user.hasStripeAccount = true;
		user.stripeAccountId = account.id;
		const result = await user.save();
		console.log('in mongo query: '+result);
		/*
		const addStripeAccount = { $set: {hasStripeAccount: true, stripeAccountId: account.id}}
		User.updateOne({username:req.user.username}, addStripeAccount, (err,result)=>{
			console.log('in mongo query: '+result);
		})
		*/
	  }
	  const origin = req.headers.origin;
	  const accountLinkURL = await generateAccountLink(account.id, origin);
	  res.json({url: accountLinkURL});
	} catch (err) {
	  res.status(500).json({
		error: err.message
	  });
	}
  });

  app.get("/stripe/account", async (req, res) => {
	  if (req.user) {
		const user = await User.findById(req.user._id).exec();
		const account = await stripe.accounts.retrieve(user.stripeAccountId);
		res.json(account);
	  } else {
		  res.status(401).json({error: "Not logged in"});
	  }
  })

  app.get("/onboard-user/refresh", async (req, res) => {
  if (!req.session.accountID) {
    res.redirect("/");
    return;
  }
  try {
    const {accountID} = req.session;
    const origin = `${req.secure ? "https://" : "https://"}${req.headers.host}`;
    
    const accountLinkURL = await generateAccountLink(accountID, origin)
    res.redirect(accountLinkURL);
  } catch (err) {
    res.status(500).send({
      error: err.message
    });
  }
});

function generateAccountLink(accountID, origin) {
	return stripe.accountLinks.create({
	  type: "account_onboarding",
	  account: accountID,
	  refresh_url: `https://payforwardapp.com/stripe_refresh.html`,
	  //change to https://payforwardapp.com/stripe_return.html when deployed
	  //change to http://localhost:3000/stripe_return.html when testing
	  return_url: `https://payforwardapp.com/stripe_return.html`,
	}).then((link) => link.url);
  }
  

app.get('/current-month-transactions-and-roundup', async (req, res, next) => {
	const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
	const currentDate = moment().format('YYYY-MM-DD');
	return await _fetchTransactionsAndRoundup(req, res, next, startOfMonth, currentDate);
});

app.get('/last-month-transactions-and-roundup', async (req, res, next) => {
	const startOfMonth = moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD');
	const endOfMonth = moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD');
	return await _fetchTransactionsAndRoundup(req, res, next, startOfMonth, endOfMonth);
});


_fetchTransactionsAndRoundup = async (req, res, next, startDate, endDate) => {
	if (req.user) {
		plaidClientErrored = false;
		const bankItems = await BankItem.find({user_id: req.user._id}).catch((err) => {
			console.log(err);
			plaidClientErrored = true;
			
		});
		if (plaidClientErrored) {
			return res.status(500).json({error: 'There has been an error obtaining the current month roundup. Please try again later.'});
		}
		
		let transactions = [];
		let totalRoundup = 0;
		let transactionsTotalAmount = 0;

		for (bankItem of bankItems) {
			const account_ids = bankItem.bank_accounts.map(bankAccount => {return bankAccount.account_id});
			if (account_ids.length > 0) {
				const transactionsToAdd = await _fetchAllBankTransactionsPaginated(bankItem.accessToken, startDate, endDate, account_ids);
				for (transaction of transactionsToAdd) {
					if (transaction.amount > 0) {
						// debit transactions only (money taken from account)
						// credit transactions (money added to the account) in plaid (e.g. salary) are represented with negative amount value
						let transactionRoundup = (((Math.ceil(transaction.amount)*100)) - (transaction.amount*100)).toFixed(10);
						console.log(Math.ceil(transaction.amount)*100, (transaction.amount*100), transactionRoundup);
						transactions.push(
							{...transaction, bankName: bankItem.institutionName, roundup: transactionRoundup/100}
						);
						totalRoundup = totalRoundup + parseFloat(transactionRoundup);
						transactionsTotalAmount = transactionsTotalAmount + parseFloat((transaction.amount*100).toFixed(10));
					}
				}
			}
		}

		const numberOfTransactions =  transactions.length;

		console.log(totalRoundup);
		console.log(totalRoundup  / numberOfTransactions / 100);
		res.json({
			transactions: transactions,
			transactionsTotalAmount: parseFloat((transactionsTotalAmount / 100).toFixed(2)),
			numberOfTransactions: numberOfTransactions,
			averageTransaction: parseFloat((transactionsTotalAmount / numberOfTransactions / 100).toFixed(4)),
			totalRoundup: parseFloat((totalRoundup / 100).toFixed(2)),
			averageRoundUp: parseFloat((totalRoundup  / numberOfTransactions / 100).toFixed(4)),
		});
	} else {
		return res.status(401).json({error: 'You are not authenticated.'});
	}
}

_fetchAllBankTransactionsPaginated = async (access_token, startDateStr, endDateStr, account_ids) => {
	const response = await client.getTransactions(access_token, startDateStr, endDateStr, {account_ids: account_ids}).catch((err) => {
		console.log('ERROR', err);
	});
	let transactions = response.transactions;
	const total_transactions = response.total_transactions;

	while (transactions.length < total_transactions) {
		const paginatedTransactionsResponse = await client.getTransactions(
			access_token, startDateStr, endDateStr,
			{account_ids, offset: transactions.length}
		);
		
		transactions = transactions.concat(paginatedTransactionsResponse.transactions);
	}

	return transactions;
}


app.listen(4000, () => {
	console.log('Server listening on port 4000.')
}); 

