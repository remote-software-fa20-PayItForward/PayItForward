//========require modules============================
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require( './db' );
require('dotenv').config();

//=========set up app================================
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const mongo_uri = process.env.MONGODB_KEY;
mongoose.connect(mongo_uri, {useUnifiedTopology:true, useNewUrlParser:true})
	.then((resolved) => console.log('The database has been successfully connected! :D'))
	.catch((err) => console.log(err));
	
const User = mongoose.model('User');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//============app routes============================
app.get('/', (req, res, next) => {
    res.send('Hello, world!');
});

app.post('/register', (req, res, next) => {
	if (req.body.password !== req.body.passwordconfirm) {
		res.status(500).send('The passwords entered are not the same');
	} else {
		const newUser = {
			username: req.body.email,
			password: req.body.password,
			first: req.body.firstname,
			last: req.body.lastname
		}
		console.log(newUser);
		User.create(newUser, function(err, user) {
			if (err) {
				console.log(err);
				res.status(500).send('Error creating user. Please try again');
			} else {
				console.log('user', user);
				console.log('Successfully created user');
				res.status(200).send('Successfully created user');
			}
		})
	}
});

app.listen(4000, () => {
	console.log('Server listening on port 4000.')
}); 
