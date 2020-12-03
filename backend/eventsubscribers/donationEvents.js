const EventEmitter = require('events');
const { model } = require('../models/BankItem');
const User = require( './models/User' );
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class DonationEventsEmitter extends EventEmitter {}

const donationEventsEmitter = new DonationEventsEmitter();

donationEventsEmitter.on('donationAmountLimitReached', async (donationRequest, totalRoundupByUsers) => {
  console.log('donationAmountLimitReached has been fired');
  console.log('donationRequest: ', donationRequest);
  for(const userSpecificTotalRoundup of totalRoundupByUsers) {
      console.log(`Total roundup of ${userSpecificTotalRoundup.totalRoundup.toFixed(2)} for user ObjectId("${userSpecificTotalRoundup.user_id}")`);
      // TODO: charge the user's CC
      const user = await User.findById(userSpecificTotalRoundup.user_id).exec();
      const paymentMethods = await stripe.paymentMethods.list({
        customer: user.stripeCustomerId,
        type: 'card',
      });
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: userSpecificTotalRoundup.totalRoundup.toFixed(2),
          currency: 'usd',
          customer: user.stripeCustomerId,
          payment_method: paymentMethods.id,
          off_session: true,
          confirm: true,
          application_fee_amount: userSpecificTotalRoundup.totalRoundup.toFixed(2) *0.029+30,
          transfer_data: {
            destination: donationRequest.user.stripeAccountId,
        },
        });
      } catch (err) {
        // Error code will be authentication_required if authentication is needed
        console.log('Error code is: ', err.code);
        const paymentIntentRetrieved = await stripe.paymentIntents.retrieve(err.raw.payment_intent.id);
        console.log('PI retrieved: ', paymentIntentRetrieved.id);
      }
      // TODO: send donationRequest completion email notification to the user 
      //enabled in stripe dashboard
  }
});

module.exports = donationEventsEmitter
