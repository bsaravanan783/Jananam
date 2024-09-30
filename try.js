// const express = require("express");
// const bodyParser = require("body-parser");
// const crypto = require("crypto");
// const cors = require("cors");
// require("dotenv").config();
// const bayController = require("./controller/bayController");
// const bayModel = require("./model/bayModel");
// const bayRoutes = require("./routes/bayRoutes");

// const handlePaymentSuccess = require("./model/paymentController");

// const app = express();
// const port = 8000;

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());


// app.use("/api", bayRoutes);

// app.post("/payment-success", async (req, res) => {
//   const paymentData = req.body;
//   console.log(paymentData);
//   const result = await handlePaymentSuccess(paymentData);
//   res.redirect("http://localhost:8000/success");
//   if (result.success) {
//     res
//       .status(200)
//       .json({
//         message: "Payment processed successfully",
//         transaction: result.transaction,
//       });
//   } else {
//     res
//       .status(500)
//       .json({ message: "Error processing payment", error: result.error });
//   }
// });

// app.get("/payment-failure", async (req, res) => {
//   console.log("hi");
//   res.redirect("http://localhost:3000/failure");
// });


// app.get("/getBays", async (req, res) => {
//   try {
//     console.log("jfdk");
//     const boysBays = await bayModel.getBayByType("MALE");
//     const girlsBays = await bayModel.getBayByType("FEMALE");

//     res.status(200).json({ boysBays, girlsBays });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ error: "Error fetching bays", details: error.message });
//   }
// });

// const merchantKey = process.env.PAYU_MERCHANT_KEY;
// const merchantSalt = process.env.PAYU_MERCHANT_SALT;

// app.post("/payment",(req,res)=>{
//   const fields = {
//     key: "Hfr7dn",
//     txnid: txnid,
//     amount: "1",
//     productinfo: "Test Product",
//     firstname: "saravanan",
//     email: "bsaravanan783@gmail.com",
//     phone: "9344480955",
//     surl: "http://localhost:8000/payment-success",
//     furl: "http://localhost:8000/payment-failure",
//   };

//   const hashField = generateHash(fields, merchantSalt);

//   fields["hash"] = hashField;

//   const encodedFields = new URLSearchParams(fields).toString();

//   const apiEndpoint = "https://test.payu.in/_payment";

//   const url = apiEndpoint + "?" + encodedFields;

//   console.log(url);

//   function generateHash(fields, salt) {
//     let hashString =
//       fields["key"] +
//       "|" +
//       fields["txnid"] +
//       "|" +
//       fields["amount"] +
//       "|" +
//       fields["productinfo"] +
//       "|" +
//       fields["firstname"] +
//       "|" +
//       fields["email"] +
//       "||||||" +
//       salt;

//     // Generate the hash
//     const hash = sha512(hashString);

//     return hash;
//   }
//   function sha512(str) {
//     return crypto.createHash("sha512").update(str).digest("hex");
//   }

// })

// app.post("/createBay", bayController.createbay);
// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });


const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const app = express();
app.use(express.json());

const merchantKey = process.env.PAYU_MERCHANT_KEY;
const merchantSalt = process.env.PAYU_MERCHANT_SALT;

// Helper function to generate the hash
function generatePayUHash(params, salt) {
  let hashString =
    params["key"] +
    "|" +
    params["txnid"] +
    "|" +
    params["amount"] +
    "|" +
    params["productinfo"] +
    "|" +
    params["firstname"] +
    "|" +
    params["email"] +
    "||||||||||" +
    salt;
    
  return crypto.createHash("sha512").update(hashString).digest("hex");
}

// Route to handle payment processing from the frontend
app.post("/payment", async (req, res) => {
  const { selectedBay, ticketCount } = req.body;

  if (!selectedBay || ticketCount <= 0 || ticketCount > 5) {
    return res
      .status(400)
      .json({ error: "Invalid ticket count or bay selection." });
  }

  const totalAmount = selectedBay.amount_of_ticket * ticketCount;
  const txnid = new Date().getTime().toString();

  // Generate hash
  const hash = generatePayUHash({
    key: merchantKey,
    txnid,
    amount: totalAmount,
    productinfo: "Test Product",
    firstname: "Anbarasan",
    email: "ajithkumar161105@gmail.com",
  }, merchantSalt);

  const postData = {
    key: merchantKey,
    txnid: txnid,
    amount: totalAmount,
    firstname: "Anbarasan",
    email: "ajithkumar161105@gmail.com",
    phone: "9876543210",
    productinfo: "Test Product",
    surl: "http://localhost:8000/payment-success",
    furl: "http://localhost:8000/payment-failure",
    hash: hash,
  };

  // Using axios to simulate the curl POST request
  try {
    const response = await axios.post(
      "https://test.payu.in/_payment",
      new URLSearchParams(postData),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json(response.data); // Respond with PayU's response (e.g., redirect URL)
  } catch (error) {
    console.error("Error during PayU request:", error.response ? error.response.data : error.message);
    res.status(500).json({ error: "Payment initiation failed." });
  }
});

// Start the server
app.listen(8000, () => {
  console.log("Server is running on http://localhost:8000");
});
