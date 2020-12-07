const express = require("express");
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require( '../models/User' );

router.post("/create-setup-intent", async (req, res) => {
	const user = await User.findById(req.user._id).exec();
	if (!user.stripeCustomerId) {
		const customer = await stripe.customers.create({
			email: user.username,
			name: user.first + " " + user.last
		});
		user.stripeCustomerId = customer.id;
		const result = await user.save();
		console.log('in mongo query: '+result);
	}
	const setupIntent = await stripe.setupIntents.create({
	    customer: user.stripeCustomerId
	});
	res.send({
	  clientSecret: setupIntent.client_secret
	});
});

router.get("/customer", async (req, res) => {
	if (req.user) {
	  const user = await User.findById(req.user._id).exec();
	  if (user.stripeCustomerId) {
	  	const customer = await stripe.customers.retrieve(user.stripeCustomerId);
	  	res.json(customer);
	  } else {
		res.json({});
	  }
	} else {
		res.status(401).json({error: "Not logged in"});
	}
})

router.post("/customer", async (req, res) => {
	if (req.user) {
	  const user = await User.findById(req.user._id).exec();
	  const customer = await stripe.customers.update(user.stripeCustomerId, req.body);
	  res.json(customer);
	} else {
		res.status(401).json({error: "Not logged in"});
	}
})

router.get("/paymentmethods", async (req, res) => {
	if (req.user) {
		const user = await User.findById(req.user._id).exec();
		if (user.stripeCustomerId) {
			const paymentmethods = await stripe.paymentMethods.list({
				customer: user.stripeCustomerId,
				type: "card"
			});
			res.json(paymentmethods);
		} else {
			res.json({data: []});
		}
	} else {
		res.status(401).json({error: "Not logged in"});
	}
})

router.get("/defaultpaymentmethod", async (req, res) => {
	if (req.user) {
		const user = await User.findById(req.user._id).exec();
		if (user.stripeCustomerId) {
			const customer = await stripe.customers.retrieve(user.stripeCustomerId);
			if (customer.invoice_settings.default_payment_method) {
				const paymentmethod = await stripe.paymentMethods.retrieve(customer.invoice_settings.default_payment_method);
				res.json(paymentmethod);
			} else {
				res.json({card: null})
			}
		} else {
			res.json({card: null});
		}
	} else {
		res.status(401).json({error: "Not logged in"});
	}
})

router.post("/onboard-user", async (req, res) => {
	try {
	  const user = await User.findById(req.user._id).exec();
	  var account;
	  if (user.hasStripeAccount) {
		account = await stripe.accounts.retrieve(user.stripeAccountId);
	  } else {
		account = await stripe.accounts.create({
			type: "express",
			email: user.username,
			business_type: "individual",
			individual: {
				email: user.username,
				first_name: user.first,
				last_name: user.last
			}
		});
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

router.get("/account", async (req, res) => {
	if (req.user) {
	    const user = await User.findById(req.user._id).exec();
		const account = await stripe.accounts.retrieve(user.stripeAccountId);
		res.json(account);
	} else {
		res.status(401).json({error: "Not logged in"});
	}
})

function generateAccountLink(accountID, origin) {
	return stripe.accountLinks.create({
	  type: "account_onboarding",
	  account: accountID,
	  refresh_url: `https://payforwardapp.com/stripe_refresh.html`,
	  return_url: `https://payforwardapp.com/stripe_return.html`,
	}).then((link) => link.url);
}

module.exports = router;