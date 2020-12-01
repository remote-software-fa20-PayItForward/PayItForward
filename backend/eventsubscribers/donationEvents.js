const EventEmitter = require('events');
const { model } = require('../models/BankItem');

class DonationEventsEmitter extends EventEmitter {}

const donationEventsEmitter = new DonationEventsEmitter();

donationEventsEmitter.on('donationAmountLimitReached', (donationRequest, totalRoundupByUsers) => {
  console.log('donationAmountLimitReached has been fired');
  console.log('donationRequest: ', donationRequest);
  for(const userSpecificTotalRoundup of totalRoundupByUsers) {
      console.log(`Total roundup of ${userSpecificTotalRoundup.totalRoundup.toFixed(2)} for user ObjectId("${userSpecificTotalRoundup.user_id}")`);
      // TODO: charge the user's CC
      // TODO: send donationRequest completion email notification to the user
  }
});

module.exports = donationEventsEmitter
