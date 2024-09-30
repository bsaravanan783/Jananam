const express = require("express");
const passport = require("passport");
const { PrismaClient } = require("@prisma/client");
const session = require("express-session");
const OIDCStrategy = require("passport-azure-ad").OIDCStrategy;
const PrismaStore = require("./prismaSessionStore");
const connectPgSimple = require("connect-pg-simple");
const crypto = require("crypto");
const cors = require("cors");
require("dotenv").config();
const bayController = require("./controller/bayController");
const bayModel = require("./model/bayModel");
const bayRoutes = require("./routes/bayRoutes");
const cookieParser = require("cookie-parser");
const userController = require("./controller/userController");
const ticketModel = require("./model/ticketModel");
const userModel = require("./model/userModel");
const paymentController = require("./model/paymentController");

require("dotenv").config();

const app = express();
const port = 8000;
const prisma = new PrismaClient();
const PgSession = connectPgSimple(session);
const corsOptions = {
  origin: ["http://localhost:3000", "http://localhost:8000"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
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
app.get(
  "/login",
  cors(corsOptions),
  passport.authenticate("azuread-openidconnect")
);

app.post(
  "/",
  passport.authenticate("azuread-openidconnect", { failureRedirect: "/" }),
  (req, res) => {
    if (!req.session) {
      return res.status(500).json({ error: "Session not initialized" });
    }

    req.session.user = req.user;
    req.session.save((err) => {
      if (err) {
        console.error("Error saving session:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
      console.log("Session saved:", req.session);
      res.redirect("http://localhost:3000/jananam");
    });
  }
);

app.post("/createTicket", userController.createUser);

// app.post("/createTicket", (req, res) => {
//   if (req.isAuthenticated() && req.session.user) {
//     console.log(req.body);
//     console.log(req.session.user._json);
//     const name = req.session.user._json.name;
//     const email = req.session.user._json.email;
//   } else {
//     res.status(401).json({ message: "Unauthorized" });
//   }
// });

// app.post(
//   "/",
//   passport.authenticate("azuread-openidconnect", { failureRedirect: "/" }),
//   (req, res) => {
//     res.redirect("http://localhost:3000/jananam");
//     // res.redirect("/");

//     console.log("kdmmlsl");
//   }
// );

app.get("/", async (req, res) => {
  if (req.isAuthenticated()) {
    if (req?.user) {
      const userData = req.user._json;
      const userExistence = await userModel.findUserByEmail(
        req.user._json.email
      );
      if (!userExistence) {
        const response = await userModel.createUser(userData);
        console.log(response);
      }
      // }
      // const response = await userModel.createUser(userData);
      // console.log(response);
    }

    res.redirect("http://localhost:3000/jananam");
    console.log(`Hello, ${req.user.displayName}!`);
    // res.send(`Hello, ${req.user.displayName}!`);
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

app.get("/check", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ user: req.user });
  } else {
    res.json({ error: "Not authenticated" });
  }
});
app.post("/payment-success", async (req, res) => {
  const paymentData = req.body;
  console.log("Payment Data:", paymentData);
  // res.redirect("http://localhost:3000/ticket");

  const result = await paymentController.handlePaymentSuccess(paymentData);

  if (result.success) {
    res.redirect("http://localhost:3000/ticket");
  } else {
    res
      .status(500)
      .json({ message: "Error processing payment", error: result.error });
  }
});

app.post("/payment-failure", async (req, res) => {
  const paymentData = req.body;
  const result = await handlePaymentFailure(paymentData);

  if (result.success) {
    res.redirect("http://localhost:3000/failure");
  } else {
    res.status(500).json({
      message: "Error processing payment failure",
      error: result.error,
    });
  }
});

app.post("/failure", async (req, res) => {
  console.log("helloe");
  const data = req.body;
  console.log(data);
  res.json({ message: "Payment" });
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
app.post("/createTicket", async (req, res) => {
  const data = await req.body;
});
function sha512(str) {
  return crypto.createHash("sha512").update(str).digest("hex");
}

function generatePayUHash(params) {
  const salt = process.env.PAYU_MERCHANT_SALT;
  let hashString = `${params.key}|${params.txnid}|${params.amount}|${params.productinfo}|${params.firstname}|${params.email}|||||||||||${salt}`;
  return sha512(hashString);
}

app.post("/payment", async (req, res) => {
  console.log(req.body);
  const userDataToUpdate = req.body;
  console.log(req.user._json);
  const userEmail = req.user._json.email;
  console.log(typeof userEmail);
  const user = await userModel.findUserByEmail(userEmail);
  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }
  const updatedUser = await userModel.updateUser(user, userDataToUpdate);

  const ticketAmount = 1500;
  const totalAmount = ticketAmount;
  const txnid = new Date().getTime().toString();

  const hash = generatePayUHash({
    key: process.env.PAYU_MERCHANT_KEY,
    txnid,
    amount: totalAmount,
    productinfo: "Test Product",
    firstname: "Anbarasan",
    email: "saravanan.22me@kct.ac.in",
  });

  const paymentData = {
    key: process.env.PAYU_MERCHANT_KEY,
    txnid,
    hash,
    amount: totalAmount,
    productinfo: "Test Product",
    firstname: "Anbarasan",
    email: "saravanan.22me@kct.ac.in",
    phone: "8056901611",
    surl: "http://localhost:8000/payment-success",
    furl: "http://localhost:8000/payment-failure",
  };

  console.log(paymentData, "fsjndfjgfdnfmdfkndljgdnlkgmflk");
  res.json(paymentData);
});

app.post("/initiate-payment", (req, res) => {
  const { paymentData } = req.body;
  const payUForm = `
    <form method="POST" action="https://test.payu.in/_payment">
        <input type="hidden" name="key" value="${paymentData.key}">
        <input type="hidden" name="txnid" value="${paymentData.txnid}">
        <input type="hidden" name="amount" value="${paymentData.amount}">
        <input type="hidden" name="productinfo" value="${paymentData.productinfo}">
        <input type="hidden" name="firstname" value="${paymentData.firstname}">
        <input type="hidden" name="email" value="${paymentData.email}">
        <input type="hidden" name="phone" value="${paymentData.phone}">
        <input type="hidden" name="surl" value="${paymentData.surl}">
        <input type="hidden" name="furl" value="${paymentData.furl}">
        <input type="hidden" name="hash" value="${paymentData.hash}">
    </form>
    <script>
        document.forms[0].submit();
    </script>
  `;

  res.send(payUForm);
});

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

app.post("/createBay", (req, res) => {
  const data = req.body;
  console.log(data);
  bayModel.createBay(data);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
