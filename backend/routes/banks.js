const express = require("express");
const router = express.Router();
const plaid = require('plaid');
const User = require( '../models/User' );
const BankItem = require( '../models/BankItem' );
const donationProgress = require('../services/donationProgress');

const client = require('../plaidclient');

router.get('/', async (req, res, next) => {

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

router.get('/accounts', async (req, res, next) => {

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

router.get('/obtain-plaid-link-token', async (req, res, next) => {
	if (req.user) {
		const response = await client.createLinkToken({
			user: {
				client_user_id: req.user._id
			},
			webhook: 'https://payforwardapp.com/plaidwebhooks/',
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

router.post('/link', async (req, res, next) => {

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
				const bankItem = BankItem.create({user_id: req.user._id, itemId: itemId, accessToken: accessToken, institutionName: institutionResponse.institution.name}, function(err, bankItem) {
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


router.post('/:bankId/link-bank-accounts', async (req, res, next) => {

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
		await matchingBankItem.save();
		await donationProgress.triggerCalculateDonationProgressByBankItem(matchingBankItem);
	} else {
		return res.status(401).json({error: 'You are not authenticated.'});
	}

	return res.status(201).json({});
});

router.get('/:bankId/accounts', async (req, res, next) => {
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

		console.log(matchingBankItem.bank_accounts);
		const bankAccountsResult = bankAccounts['accounts'].map((bankAccount) => {
			console.log(bankAccount);
			console.log(matchingBankItem.bank_accounts.some((bankAccountOnFile) => {return bankAccountOnFile.account_id == bankAccount.account_id}));
			return {
			...bankAccount,
			isChecked: matchingBankItem.bank_accounts.some((bankAccountOnFile) => {return bankAccountOnFile.account_id == bankAccount.account_id})
		}});

		res.json({
			bankAccounts: bankAccountsResult,
			bankItem: matchingBankItem
		});
	} else {
		return res.status(401).json({error: 'You are not authenticated.'});
	}
});

router.get('/:bankId/accounts/:accountId/transactions', async (req, res, next) => {

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


module.exports = router;