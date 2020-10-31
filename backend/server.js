const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const plaid = require('plaid');

//API keys are stored in keys.js
const {PLAID_CLIENT_ID, PLAID_SECRET} = require('./keys');

//initialize Plaid API, need post/get functions to display page
const client = new plaid.Client({
    clientID: PLAID_CLIENT_ID,
    secret: PLAID_SECRET,
    env: plaid.environments.sandbox
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.send('Hello, world!');
});

app.listen(4000, () => {
	console.log('Server listening on port 4000.')
}); 
