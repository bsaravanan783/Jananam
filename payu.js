// server.js
const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// PayU Credentials
const merchantKey = 'YOUR_MERCHANT_KEY';
const salt = 'YOUR_SALT';

// Generate hash function
function generateHash(params) {
    let hashString = `${merchantKey}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${salt}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
}

// Payment Route
app.post('/payu', (req, res) => {
    const params = {
        txnid: req.body.txnid,
        amount: req.body.amount,
        productinfo: req.body.productinfo,
        firstname: req.body.firstname,
        email: req.body.email,
    };

    const hash = generateHash(params);
    res.render('payment', { params, hash });
});

// Success Route
app.post('/success', (req, res) => {
    // Handle success response from PayU
    console.log('Payment Successful:', req.body);
    res.send('Payment Successful');
});

// Failure Route
app.post('/failure', (req, res) => {
    // Handle failure response from PayU
    console.log('Payment Failed:', req.body);
    res.send('Payment Failed');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});