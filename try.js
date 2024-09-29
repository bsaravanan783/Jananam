const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();
const bayController = require("./controller/bayController");
const bayModel = require("./model/bayModel");
const bayRoutes = require("./routes/bayRoutes");

const handlePaymentSuccess = require("./model/paymentController");

const app = express();
const port = 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors());


app.use("/api", bayRoutes);

app.post("/payment-success", async (req, res) => {
  const paymentData = req.body;
  console.log(paymentData);
  const result = await handlePaymentSuccess(paymentData);
  res.redirect("http://localhost:8000/success");
  if (result.success) {
    res
      .status(200)
      .json({
        message: "Payment processed successfully",
        transaction: result.transaction,
      });
  } else {
    res
      .status(500)
      .json({ message: "Error processing payment", error: result.error });
  }
});

app.get("/payment-failure", async (req, res) => {
  console.log("hi");
  res.redirect("http://localhost:3000/failure");
});


app.get("/getBays", async (req, res) => {
  try {
    console.log("jfdk");
    const boysBays = await bayModel.getBayByType("MALE");
    const girlsBays = await bayModel.getBayByType("FEMALE");

    res.status(200).json({ boysBays, girlsBays });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching bays", details: error.message });
  }
});

const merchantKey = process.env.PAYU_MERCHANT_KEY;
const merchantSalt = process.env.PAYU_MERCHANT_SALT;

const generatePayUHash = (formData) => {
  const { txnid, amount, productinfo, firstname, email } = formData;
  const hashString = `${merchantKey}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|||||||||||${merchantSalt}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
};

app.post("/generate-hash", (req, res) => {
  const { amount, productinfo, firstname, email } = req.body;

  if (!amount || !firstname || !email) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const txnid = new Date().getTime().toString();

  // Generate the hash using the provided data
  const hash = generatePayUHash({
    txnid,
    amount,
    productinfo,
    firstname,
    email,
  });

  // Respond with the necessary fields for the frontend form submission
  res.json({
    key: merchantKey, // Don't expose in frontend directly
    txnid,
    hash,
    amount,
    productinfo,
    firstname,
    email,
  });
});

app.post("/createBay", bayController.createbay);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
