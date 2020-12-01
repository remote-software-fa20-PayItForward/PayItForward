const express = require("express");
const router = express.Router();
const multer = require('multer');
const upload = multer();
const Image = require( '../models/Image' );
const DonationRequest = require('../models/DonationRequest');
const User = require('../models/User');
const donationProgress = require("../services/donationProgress");


router.post('/', upload.single('image'), (req, res, next) => {
	User.findOne( {username: req.user.username} ).then(user => {
		if (user) {
            Image.create({data: req.file.buffer, name: req.file.originalname, mime: req.file.mimetype}, function(err, image) {
                if (err) {
                    console.log(err);
                    return res.status(500).json({error: 'Error uploading image. Please try again'});
                } else {                    
                    const newDonation = {
                        name: req.body.name, 
                        image: '/images/' + image._id, 
                        description: req.body.description,
                        category: req.body.category,
                        amount: req.body.amount,
                        user: user._id,
						status: "active"
                    }
                    DonationRequest.create(newDonation, function(err, donationRequest) {
                        if (donationRequest) {
                            console.log(donationRequest);
                            return res.json();
                        } else {
                            console.log(err);	
                            return res.status(500).json({error: 'Error creating donation request object'})
                        }
                    })
                }
            });
		} else {
			console.log('Error finding user in /donation-request');	
			return res.status(500).json({error: 'Error finding user to create donation request object'})
		}
	});
});

router.get('/', (req, res, next) => {
	if (req.user) {
		DonationRequest.findOne ( { user: req.user._id} ).then(donationRequest => {
			return res.json( JSON.parse(JSON.stringify(donationRequest)) );
		})
	} else {
        return res.status(401).json({error: "Not logged in"});
    }
});

router.get('/all', (req, res) => {
    DonationRequest.find().then((donationRequests) => {
        if (donationRequests) {
            return res.json(donationRequests);
        }
    }).catch(() => {
        return res.status(500).json({error: "Cannot get donation requests"});
    });
})

router.get('/:id', (req, res, next) => {
    DonationRequest.find({ user: req.user._id}).then((donationRequests) => {
        if (donationRequests) {
            return res.json( JSON.parse(JSON.stringify(donationRequests)) );
        } else {
            return res.status(404).json({error: "The donation requests was not found"});
        }
    }).catch(() => {
        return res.status(400).json({error: "Invalid user ID"});
    });
});

router.post('/request/:request_id', (req, res, next) => {
	DonationRequest.findOneAndUpdate({ _id: req.params.request_id}, {$addToSet: { subscribers: req.user._id }}, { new: true }).then((donationRequest) => {
		if (donationRequest) {
            donationProgress.triggerDonationProgressCalculaton(donationRequest).then(() => {
                console.log('calculation has been triggered');
            });

			return res.json();
		} else {
			return res.status(400).json({error: "The donation request subscription was unsuccessful"});
		}
	}).catch(() => {
		return res.status(400).json({error: "Invalid donation request ID"});
	});
});

router.get('/category/:category', (req, res, next) => {
	DonationRequest.find( {category: req.params.category} )
	.populate('user' , '-passwordHash -mfaEnabled')
	.then((donationRequests) => {
		console.log(donationRequests);
        if (donationRequests) {
            return res.json(donationRequests);
        }
    }).catch(() => {
        return res.status(500).json({error: "Cannot get donation requests"});
    });
	/*
	if (req.user) {
		DonationRequest.findOne ( { user: req.user._id} ).then(donationRequest => {
			return res.json( JSON.parse(JSON.stringify(donationRequest)) );
		})
	} else {
        return res.status(401).json({error: "Not logged in"});
    }
	*/
});

router.post('/image', upload.single('myFile'), (req, res, next) => {
    Image.create({data: req.file.buffer, name: req.file.originalname, mime: req.file.mimetype}, function(err, image) {
		if (err) {
			console.log(err);
			return res.status(500).json({error: 'Error uploading image. Please try again'});
		} else {
            return res.json({success: "Uploaded image", id: image._id});
        }
    });
});

module.exports = router;