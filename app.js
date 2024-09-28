const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();
const bayController = require("./controller/bayController");
const bayModel = require("./model/bayModel");
const bayRoutes = require("./routes/bayRoutes");
const passport = require("passport");
const session = require("express-session");
const OIDCStrategy = require("passport-azure-ad").OIDCStrategy;

const handlePaymentSuccess = require('./model/paymentController')

const app = express();
const port = 8000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

app.use(
  session({ secret: process.env.SOCIAL_AUTH_AZUREAD_OAUTH2_SECRET, resave: false, saveUninitialized: true })
);
app.use(passport.initialize());
app.use(passport.session());
const tenant = process.env.SOCIAL_AUTH_AZUREAD_TENANT_OAUTH2_TENANT_ID;
passport.use(
  new OIDCStrategy(
    {
      identityMetadata: `https://login.microsoftonline.com/${tenant}/v2.0/.well-known/openid-configuration`,
      clientID: "Your Client ID",
      clientSecret: "Your Client Secret",
      responseType: "code",
      responseMode: "form_post",
      redirectUrl: "http://localhost:3000/auth/callback",
      allowHttpForRedirectUrl: true,
      passReqToCallback: false,
      scope: ["profile", "email", "openid"],
      loggingLevel: "info",
    },
    function (iss, sub, profile, accessToken, refreshToken, done) {
      return done(null, profile);
    }
  )
);

app.get("/complete/azuread-oauth2/",(req, res) => {
  passport.authenticate("azuread-openidconnect", {
    successRedirect: "/",
    failureRedirect: "/",
  })(req, res);
})

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

app.use("/api", bayRoutes);

app.post('/payment-success', async (req, res) => {
  const paymentData = req.body; // Assuming this contains necessary data
  console.log(paymentData);
  const result = await handlePaymentSuccess(paymentData);
  if (result.success) {
      res.status(200).json({ message: "Payment processed successfully", transaction: result.transaction });
  } else {
      res.status(500).json({ message: "Error processing payment", error: result.error });
  }
});


app.get(
  "/login",
  passport.authenticate("azuread-openidconnect", { failureRedirect: "/" })
);

app.post(
  "/auth/callback",
  passport.authenticate("azuread-openidconnect", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");
  }
);

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
