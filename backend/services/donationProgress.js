const BankItem = require("../models/BankItem");
const DonationRequest = require("../models/DonationRequest");
const moment = require('moment');
const Transaction = require("../models/Transaction");
const Big = require('big.js');
const donationEventsEmitter = require("../eventsubscribers/donationEvents");


class DonationProgressCalculationException extends Error {
    constructor(message) {
      super(message);
      this.name = "DonationProgressCalculationException";
    }
  }
  


const findEligibleTransactionsByBankItem = async (bankItem) => {
    const linkedBankAccountIds = bankItem.bank_accounts.map(function(el) {return el.account_id});
    //const startDate = moment().subtract(30, 'days').format('YYYY-MM-DD');
    //return await Transaction.find({"isMarkedForDeletion": false, "bankAccountId": {$in: linkedBankAccountIds}, "date": {$gte : startDate}}).sort({date: 'asc'});
    return await Transaction.find({"isMarkedForDeletion": false, "bankAccountId": {$in: linkedBankAccountIds}}).sort({date: 'asc'});
}


/**
 * Calculate Donation Progress by bankItem.
 *
 * @param {BankItem} Plaid bankItem instance.
 */
const triggerCalculateDonationProgressByBankItem = async (bankItem) => {

    // the bankItem belongs to particular user, find a donationRequest for this user
    // (1 user can subscribe up to 1 active donation at any given time)
    const donationRequest = await DonationRequest.findOne({"status": "active", "subscribers": {$all: bankItem.user_id}});
    if (donationRequest != null) {
        return triggerDonationProgressCalculaton(donationRequest);
    }
}


/**
 * Triggers Calculation of Donation Progress for specific donationRequest.
 * 
 * Fires donationAmountLimitReached event in case the donation request amount has been covered by the total roundup sum of 
 * transactionns beloning to 1 or more subcribers.
 * 
 *
 * @param {DonationRequest} donationRequest the donationRequest object for which to trigger donation progress calculation.
 */
const triggerDonationProgressCalculaton = async (donationRequest) => {
    console.log(`DONATION PROGRESS CALCULATION TRIGGERED FOR ${donationRequest.name} ObjectId(${donationRequest._id})`);
    // Ensure the donationRequest is in active state
    if(donationRequest.status != 'active') {
        throw new DonationProgressCalculationException(`Can't calculate progress for donationRequest object whcih isn't in active status.`);
    }

    // obtain list of bankItems for all donationRequest subscribers
    const bankItems = await BankItem.find({"user_id": {$in: donationRequest.subscribers}});
    
    let roundupSum = new Big(0);
    const donationTransactionIdBucketList = [];
    const totalRoundupByUsers = [];

    // for each bankItem:
    for(const bankItem of bankItems) {
        // obtain list of tranasctions which are eligible for rundup calculation 
        // that is transactions which aren't yet marked for deletion and which are ralated with linked bank accounts
        if (bankItem.bank_accounts.length > 0) {
            const transactions = await findEligibleTransactionsByBankItem(bankItem);
            // iterate over the transactions, sum them up and check if the roundup reaches the donation amount limit
            for(const transaction of transactions) {
                donationTransactionIdBucketList.push(transaction._id);
                const transactionRoundup = new Big(transaction.amount).round(0,3).minus(new Big(transaction.amount));

                let userSpecificTotalRoundup = totalRoundupByUsers.find(element => {
                    return (element.user_id.toString() == bankItem.user_id.toString())
                });
                if (userSpecificTotalRoundup == null) {
                    userSpecificTotalRoundup = {
                        "user_id": bankItem.user_id,
                        "totalRoundup": new Big(0)
                    }
                    totalRoundupByUsers.push(userSpecificTotalRoundup);
                }
                userSpecificTotalRoundup.totalRoundup = userSpecificTotalRoundup.totalRoundup.plus(transactionRoundup);


                roundupSum = roundupSum.plus(transactionRoundup);
                if (roundupSum >= donationRequest.amount) {
                    break;
                }
            }
            if (roundupSum >= donationRequest.amount) {
                break;
            }
        }
    }

    await DonationRequest.findOneAndUpdate({"_id": donationRequest._id}, {$set: {"amountCollected": roundupSum}});
    console.log(`DONATION PROGRESS CALCULATION RESULT FOR ${donationRequest.name} ObjectId(${donationRequest._id}): ROUNDUP SUM = ${roundupSum}`);

    if (roundupSum >= donationRequest.amount) {
        donationRequest = await DonationRequest.findOneAndUpdate({"_id": donationRequest._id}, {$set: {"status": "completed"}}, { new: true });

        // Mark all transactions for deletion (this means that they aren't going to be used to calculate roundupSum for any other donationRequest's)
        await Transaction.updateMany({"_id": {$in: donationTransactionIdBucketList}}, {$set: {"isMarkedForDeletion": true}});
        
        donationEventsEmitter.emit("donationAmountLimitReached", donationRequest, totalRoundupByUsers);
    }
}

module.exports = {triggerCalculateDonationProgressByBankItem, triggerDonationProgressCalculaton};
