const express = require("express");
const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const session = require("express-session");
const OIDCStrategy = require("passport-azure-ad").OIDCStrategy;
const PrismaStore = require("./prismaSessionStore");
const connectPgSimple = require("connect-pg-simple");
const bodyParser = require("body-parser");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();
const bayController = require("./controller/bayController");
const bayModel = require("./model/bayModel");
const bayRoutes = require("./routes/bayRoutes");

const handlePaymentSuccess = require("./model/paymentController");

require("dotenv").config();
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:8000"],
  credentials: true,
};

const app = express();
const port = 8000;
const prisma = new PrismaClient();
const PgSession = connectPgSimple(session);

app.use(cors(corsOptions));
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

const sessionMiddleware = session({
  store: new PgSession({
    prisma: prisma,
    tableName: "Session",
  }),
  secret: process.env.SOCIAL_AUTH_AZUREAD_OAUTH2_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000 * 10,
    priority: "high",
    httpOnly: false,
  },
});

app.use(sessionMiddleware);

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
// app.use(
//   session({
//     secret: process.env.SOCIAL_AUTH_AZUREAD_OAUTH2_SECRET,
//     resave: false,
//     saveUninitialized: false,
//     store: new PrismaStore(prisma),
//     cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 },
//   })
// );

const tenant = process.env.SOCIAL_AUTH_AZUREAD_TENANT_OAUTH2_TENANT_ID;

passport.use(
  new OIDCStrategy(
    {
      identityMetadata: `https://login.microsoftonline.com/${tenant}/v2.0/.well-known/openid-configuration`,
      clientID: process.env.SOCIAL_AUTH_AZUREAD_OAUTH2_KEY,
      clientSecret: process.env.SOCIAL_AUTH_AZUREAD_OAUTH2_SECRET,
      responseType: "code",
      responseMode: "form_post",
      redirectUrl: "http://localhost:8000/",
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

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

// app.get("/login", passport.authenticate("azuread-openidconnect"));
app.get("/login", cors(corsOptions), passport.authenticate("azuread-openidconnect"));

// app.post("/login", (req, res, next) => {
//   passport.authenticate("azuread-openidconnect", (err, user, info) => {
//     if (err) {
//       return res.status(500).json({ error: err });
//     }
//     if (!user) {
//       return res.status(401).json({ message: "Authentication failed" });
//     }
//     req.login(user, (err) => {
//       if (err) {
//         return res.status(500).json({ error: err });
//       }
//       return res.status(200).json({ message: "Login successful", user });
//     });
//   })(req, res, next);
// });

app.post(
  "/",
  passport.authenticate("azuread-openidconnect", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/");

    console.log("kdmmlsl")
  }
);

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`Hello, ${req.user.displayName}!`);
  } else {
    res.send("Please log in first.");
  }
});

app.get("/logout", (req, res) => {
  req.logout(() => {
    res.redirect("/");
  });
});

// seperate for payment

//jskjfk

app.use("/api", bayRoutes);

app.post("/payment-success", async (req, res) => {
  const paymentData = req.body;
  console.log(paymentData);
  const result = await handlePaymentSuccess(paymentData);
  res.redirect("http://localhost:8000/success");
  if (result.success) {
    res.status(200).json({
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

  const hash = generatePayUHash({
    txnid,
    amount,
    productinfo,
    firstname,
    email,
  });

  res.json({
    key: merchantKey,
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
