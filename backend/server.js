const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res, next) => {
    res.send('Hello, world!');
});

app.listen(4000, () => {
	console.log('Server listening on port 4000.')
}); 
