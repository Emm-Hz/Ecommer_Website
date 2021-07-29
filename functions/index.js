/* eslint-disable max-len */
/* eslint-disable indent */
const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")(
  "sk_test_51JG8yzF0wGEL4WeIWtVegsnrsKPMh7BwvZYXfA2vFeJ3rP4KNGGz74psnl4TKFWpaks3CDS96P4Gt9yybqlh7FhL00elpVm3Vv"
);

const app = express();

app.use(
  cors({
    origin: true,
  })
);
app.use(express.json());

app.post("/payment/create", async (req, res) => {
  try {
    const { amount, shipping } = req.body;
    const paymentIntent = await stripe.paymentIntents.create({
      shipping,
      amount,
      currency: "usd",
    });

    res.status(200).send(paymentIntent.client_secret);
  } catch (error) {
    res.statusMessage(500).json({
      statusCode: 500,
      message: error.message,
    });
  }
});

app.get("*", (req, res) => {
  res.status(404).send("404, Not Found");
});

exports.api = functions.https.onRequest(app);
