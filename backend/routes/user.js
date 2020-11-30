const express = require("express");
const router = express.Router();
const multer = require('multer');
const bcrypt = require('bcrypt');
const User = require( '../models/User' );
const Image = require( '../models/Image' );
var upload = multer();
const saltRounds = 10;

router.get('/', (req, res, next) => {
	if (req.user) {
		let loggedInUser = JSON.parse(JSON.stringify(req.user));
		delete loggedInUser.passwordHash;
		return res.json(loggedInUser);
	} else {
		return res.json({});
	}
})

 router.get('/:username', (req, res, next) => {
 	console.log('hi');
 	User.findOne({username: req.username}).then(user => {
 		if(user) {
 			let viewedUser = JSON.parse(JSON.stringify(user));
 			return res.json(viewedUser);
 		} else {
 			return res.status(500).json({error: 'issue finding user'});
 		}
 	})
 }) 

router.post('/update', (req, res, next) => {
	let updateUser = req.body; /*
	let hash = '';
    
    updateUser.bio = req.body.bio ? req.body.bio : req.user.bio;
    updateUser.first = req.body.first ? req.body.first : req.user.first;
    updateUser.last = req.body.last ? req.body.last : req.user.last;
    updateUser.username = req.body.username ? req.body.username : req.user.username;
    updateUser.mfaEnabled = req.body.mfaEnabled !== undefined ? req.body.mfaEnabled : req.user.mfaEnabled;
    if (req.body.password) updateUser.password = req.body.password;
    
	if (req.body.passwordHash) {
		bcrypt.hash(req.body.passwordHash, saltRounds, function(err, hash) {
			updateUser.passwordHash = hash;

			User.updateOne({username: req.user.username}, updateUser).then(updatedUser => {
				if(updatedUser) {
					return res.json({success: 'Successfully updated user'})
				} else {
					return res.status(500).json({error: 'Error updating user'})
				}
			})
		});
	} else {
		User.updateOne({username: req.user.username}, updateUser).then(updatedUser => {
			if(updatedUser) {
				return res.json({success: 'Successfully updated user'})
			} else {
				return res.status(500).json({error: 'Error updating user'})
			}
		})
    }*/
    User.updateOne({username: req.user.username}, updateUser).then(updatedUser => {
        if(updatedUser) {
            return res.json({success: 'Successfully updated user'})
        } else {
            return res.status(500).json({error: 'Error updating user'})
        }
    })
})

router.post('/profilephoto', upload.single('myFile'), (req, res) => {
	console.log(req.file);
	Image.create({data: req.file.buffer, name: req.file.originalname, mime: req.file.mimetype}, function(err, image) {
		if (err) {
			console.log(err);
			return res.status(500).json({error: 'Error uploading image. Please try again'});
		} else {
			User.updateOne({_id: req.user._id}, {avatar: '/images/' + image._id}).then(response => {
				if(response) {
					return res.json({Success: 'Successfully updated profile photo'})
				} else {
					return res.status(500).json({error: 'Issue updating profile photo'})
				}
			});
		}
	});
});

module.exports = router;