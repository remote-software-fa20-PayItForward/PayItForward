const express = require("express");
const router = express.Router();
const BankItem = require("../models/BankItem");
const moment = require('moment');
const client = require('../plaidclient');
const Transaction = require("../models/Transaction");

router.post('/', async (req, res, next) => {
    handleTransactionsWebhook(req.body);
    res.json({ status: 'ok' });
});



const fetchAllBankTransactionsPaginated = async (bankItem, startDateStr, endDateStr) => {
	const response = await client.getTransactions(bankItem.accessToken, startDateStr, endDateStr).catch((err) => {
		console.log('ERROR', err);
	});
	let transactions = response.transactions;
	const total_transactions = response.total_transactions;

	while (transactions.length < total_transactions) {
		const paginatedTransactionsResponse = await client.getTransactions(
			bankItem.accessToken, startDateStr, endDateStr,
			{offset: transactions.length}
		);
		
		transactions = transactions.concat(paginatedTransactionsResponse.transactions);
	}

	return transactions;
}

const storeTransactions = async (bankItem, transactionsToStore) => {
    const transasctionRecordsToStore = [];
    for (const transactionToStore of transactionsToStore) {
        transasctionRecordsToStore.push({
            transaction_id: transactionToStore.transaction_id,
            userId: bankItem.user_id,
            bankItemId: bankItem.itemId,
            bankAccountId: transactionToStore.account_id,
            name: transactionToStore.name,
            merchant_name: transactionToStore.merchant_name,
            categories: transactionToStore.category,
            transaction_type: transactionToStore.transaction_type,
            amount: transactionToStore.amount,
            date: transactionToStore.date
        });
    }
    console.log("transasctionRecordsToStore", transasctionRecordsToStore.length);
    if (transasctionRecordsToStore.length > 0) {
        await Transaction.insertMany(transasctionRecordsToStore).catch((error) => { 
            console.log(error);
        });
    }
};

const removeTransactions = async (transactionsToRemove) => {
    console.log('transactionsToRemove', transactionsToRemove);
    const transasctionIdsToRemove = [];
    for (const transactionToStore of transactionsToRemove) {
        transasctionIdsToRemove.push(transactionToStore.transaction_id);
    }
    console.log("transasctionIdsToRemove", transasctionIdsToRemove);
    if (transasctionIdsToRemove.length > 0) {
        await Transaction.deleteMany({'transaction_id': {'$in': transasctionIdsToRemove}}).catch((error) => { 
            console.log(error);
        });
    }
}

const removeTransactionByTransactionIds = async (transasctionIdsToRemove) => {
    console.log('transasctionIdsToRemove', transasctionIdsToRemove);
    if (transasctionIdsToRemove.length > 0) {
        await Transaction.deleteMany({'transaction_id': {'$in': transasctionIdsToRemove}}).catch((error) => { 
            console.log(error);
        });
    }
}


/**
 * Handles the fetching and storing of new transactions in response to an update webhook.
 *
 * @param {string} itemId the Plaid ID for the item.
 * @param {string} startDate the earliest date to retrieve ('YYYY-MM-DD').
 * @param {string} endDate the latest date to retrieve ('YYYY-MM-DD').
 */
const handleTransactionsUpdate = async (itemId, startDate, endDate) => {
    const bankItem = await BankItem.findOne({"itemId": itemId});
    if (bankItem == null) {
        console.log("Unable to find matching BankItem instance in our databse");
        return;
    }
    // Fetch new transactions from plaid api.
    const incomingTransactions = await fetchAllBankTransactionsPaginated(bankItem, startDate, endDate);
    console.log('incomingTransactions list:', incomingTransactions);

    // Retrieve existing transactions from our db.
    const existingTransactions = await Transaction.find({"bankItemId": itemId, "date": {$gte : startDate, $lte: endDate}})

    // Compare to find new transactions.
    const existingTransactionIds = existingTransactions.reduce(
    (idMap, { transaction_id: transactionId }) => ({
        ...idMap,
        [transactionId]: transactionId,
    }),
    {}
    );

    const transactionsToStore = incomingTransactions.filter(
    ({ transaction_id: transactionId }) => {
        const isExisting = existingTransactionIds[transactionId];
        return !isExisting;
    }
    );

    // Compare to find removed transactions (pending transactions that have posted or cancelled).
    const incomingTransactionIds = incomingTransactions.reduce(
    (idMap, { transaction_id: transactionId }) => ({
        ...idMap,
        [transactionId]: transactionId,
    }),
    {}
    );

    const transactionsToRemove = existingTransactions.filter(
    ({ transaction_id: transactionId }) => {
        const isIncoming = incomingTransactionIds[transactionId];
        return !isIncoming;
    }
    );

    console.log("transactionsToStore", transactionsToStore.length);
    console.log("transactionsToRemove", transactionsToRemove.length);

    // Update the DB (add records) if needed
    if (transactionsToStore.length > 0) {
        await storeTransactions(bankItem, transactionsToStore);
    }

    // Update the DB (remove records) if needed
    if (transactionsToRemove.length > 0) {
        await removeTransactions(transactionsToRemove);
    }
};


const handleTransactionsWebhook = async (requestBody) => {
    console.log(requestBody);
    const {
      webhook_code: webhookCode,
      item_id: itemId,
      new_transactions: newTransactions,
      removed_transactions: removedTransactions,
    } = requestBody;
  
    const logWebhook = (additionalInfo) => { console.log(`WEBHOOK: TRANSACTIONS: ${webhookCode}: Plaid_item_id ${itemId}: ${additionalInfo}` ) };
  
    switch (webhookCode) {
      case 'INITIAL_UPDATE': {
        // Fired when an Item's initial transaction pull is completed.
        // Note: The default pull is 30 days.
        const startDate = moment()
          .subtract(30, 'days')
          .format('YYYY-MM-DD');
        const endDate = moment().format('YYYY-MM-DD');
        
        await handleTransactionsUpdate(itemId, startDate, endDate);
        logWebhook(`${newTransactions} transactions to add.`, itemId);
        break;
      }
      case 'HISTORICAL_UPDATE': {
        // Fired when an Item's historical transaction pull is completed. Plaid fetches as much
        // data as is available from the financial institution.
    
        // We don't need to obtain records here. We don't really need anything older than 30 days (and that has already been imported as part of the INITIAL_UPDATE)
        break;
      }
      case 'DEFAULT_UPDATE': {
        // Fired when new transaction data is available as Plaid performs its regular updates of
        // the Item. Since transactions may take several days to post, we'll fetch 14 days worth of
        // transactions from Plaid and reconcile them with the transactions we already have stored.
        const startDate = moment()
          .subtract(14, 'days')
          .format('YYYY-MM-DD');
        const endDate = moment().format('YYYY-MM-DD');
        await handleTransactionsUpdate(itemId, startDate, endDate);
        logWebhook(`${newTransactions} transactions to add.`, itemId);
        break;
      }
      case 'TRANSACTIONS_REMOVED': {
        // Fired when posted transaction(s) for an Item are deleted. The deleted transaction IDs
        // are included in the webhook payload.
        await removeTransactionByTransactionIds(removedTransactions);
        logWebhook(`${removedTransactions.length} transactions to remove.`);
        break;
      }
      default:
        logWebhook(`unhandled webhook type received.`);
    }
};



module.exports = router;
