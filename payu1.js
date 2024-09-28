import express from 'express';
import crypto from 'crypto';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const apiEndpoint = "https://test.payu.in/_payment";

const merchantKey = 'ZLvSOt'; 
const salt = 'TmooTx5BZ3piygXAgjna5vT5I7y4IkRF'; 

console.log("Merchant Key:", merchantKey);

const generateHash = (params, salt) => {
    const hashString = Object.keys(params)
        .sort()
        .map(key => `${key}=${params[key]}`)
        .join('|') + `|${salt}`;
    return crypto.createHash('sha512').update(hashString).digest('hex');
};

// app.post('/generate-payment-url', (req, res) => {
//     const { amount, productInfo, firstName, email, phone } = req.body;

//     const txnId = "TXN" + Date.now(); 
//     const surl = "https://yourwebsite.com/payment-success"; 
//     const furl = "https://yourwebsite.com/payment-failure"; 

//     const params = {
//         "key": merchantKey, 
//         "txnid": txnId,
//         "amount": amount,
//         "productinfo": productInfo,
//         "firstname": firstName,
//         "email": email,
//         "phone": phone,
//         "surl": surl,
//         "furl": furl,
//     };

//     console.log("Payment Parameters:", params); // Log the payment parameters

//     const hash = generateHash(params, salt);
//     params["hash"] = hash;

//     const encodedParams = new URLSearchParams(params).toString();
//     const paymentUrl = `${apiEndpoint}?${encodedParams}`;

//     console.log(paymentUrl); // Log the payment URL for debugging
//     res.json({ paymentUrl }); // Send the payment URL back to the client
// });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
