const express = require("express");
const router = express.Router();
const DonationRequest = require('../models/DonationRequest');
const User = require('../models/User');
const DonationRecord = require('../models/DonationRecord');
const donationProgress = require("../services/donationProgress");

router.get('/:id', (req, res, next) => {
	console.log(req.params.id);
	DonationRecord.find({user: req.params.id}).then(donationRecords => {
		if (donationRecords) {
			return res.json( JSON.parse(JSON.stringify(donationRecords)) );
		} else {
			return res.status(401).json({error: "Unable to find donation records"});
		}
	});
});

module.exports = router;
