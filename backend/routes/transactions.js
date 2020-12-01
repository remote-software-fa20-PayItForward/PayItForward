const express = require("express");
const router = express.Router();
const BankItem = require("../models/BankItem");
const moment = require('moment');
const Transaction = require("../models/Transaction");
const Big = require('big.js');

router.get('/all-transactions', async (req, res, next) => {
	return await _fetchTransactionsAndRoundup(req, res, next);
});

const _fetchTransactionsAndRoundup = async (req, res, next) => {
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
		let totalRoundup = new Big(0);
		let transactionsTotalAmount = new Big(0);

		for (bankItem of bankItems) {
			const account_ids = bankItem.bank_accounts.map(bankAccount => {return bankAccount.account_id});
			if (account_ids.length > 0) {
				const transactionsToAdd = await Transaction.find({"bankAccountId": {$in: account_ids}}).sort({date: 'asc'});
				for (transaction of transactionsToAdd) {
					if (transaction.amount > 0) {
						// debit transactions only (money taken from account)
						// credit transactions (money added to the account) in plaid (e.g. salary) are represented with negative amount value
						let transactionRoundup = new Big(transaction.amount).round(0,3).minus(new Big(transaction.amount));
						transactions.push(
							{...transaction._doc, bankName: bankItem.institutionName, roundup: transactionRoundup.toFixed(2)}
						);
						totalRoundup = totalRoundup.plus(transactionRoundup);
						transactionsTotalAmount = transactionsTotalAmount.plus(new Big(transaction.amount));
					}
				}
			}
		}

		const numberOfTransactions = transactions.length;
		res.json({
			transactions: transactions,
			transactionsTotalAmount: transactionsTotalAmount.toFixed(2),
			numberOfTransactions: numberOfTransactions,
			averageTransaction: numberOfTransactions > 0 ? transactionsTotalAmount.div(new Big(numberOfTransactions)).toFixed(4) : 0,
			totalRoundup: totalRoundup.toFixed(2),
			averageRoundUp: numberOfTransactions > 0 ? totalRoundup.div(new Big(numberOfTransactions)).toFixed(4) : 0
		});
	} else {
		return res.status(401).json({error: 'You are not authenticated.'});
	}
}


module.exports = router;
