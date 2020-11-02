//========require modules============================
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const plaid = require('plaid');
require( './db' );
require('dotenv').config();

//=========set up app================================
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//setup plaid
const plaid_id = process.env.PLAID_CLIENT_ID;
const plaid_secret = process.env.PLAID_SECRET;
const plaid_env = process.env.PLAID_ENV;

const client = new plaid.Client({
	clientID: plaid_id,
	secret: plaid_secret,
	env: plaid_env
});

//
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

app.listen(4000, () => {
	console.log('Server listening on port 4000.')
}); 
