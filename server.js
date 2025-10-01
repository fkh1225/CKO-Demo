require("dotenv").config();
const express = require("express");
const path = require("path");
const fetch = require("node-fetch");
const app = express();

app.use(express.static("public"));
// This line tells Express to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());

const PORT = process.env.PORT || 3002;

// Insert your secret key here
const SECRET_KEY = process.env.SECRET_KEY;
const pcidHK = process.env.PCID_HK;

const alipayHK = {
  amount: 9000,
  currency: "HKD",
  reference: "ORD-123A",
  display_name: "Online shop",
  payment_type: "Regular",
  billing: {
    address: {
      country: "HK",
    },
  },
  customer: {
    name: "Neal Fung",
    email: "neal@dummy.com",
  },
  items: [
    {
      reference: "0001",
      name: "New iPhone Case designed by Neal",
      quantity: 1,
      unit_price: 9000,
    },
  ],
  capture: true,
  // "3ds": {
  //   enabled: true,
  // }, // The "3ds" property is commented out here as it was in your example.
  processing_channel_id: pcidHK,
  success_url: "https://example.com/payments/success",
  failure_url: "https://example.com/payments/failure",
};

// const iDeal = {
//   amount: 9000,
//   currency: "EUR",
//   reference: "ORD-123A",
//   display_name: "Online shop",
//   payment_type: "Regular",
//   billing: {
//     address: {
//       country: "NL",
//     },
//   },
//   customer: {
//     name: "Jia Tsang",
//     email: "jia.tsang@example.com",
//   },
//   items: [
//     {
//       reference: "0001",
//       name: "Gold Necklace",
//       quantity: 9,
//       unit_price: 1000,
//     },
//   ],
//   capture: true,
//   // "3ds": {
//   //   enabled: true,
//   // }, // The "3ds" property is commented out here as it was in your example.
//   processing_channel_id: pcid,
//   success_url: "https://example.com/payments/success",
//   failure_url: "https://example.com/payments/failure",
// };

app.post("/create-payment-sessions", async (_req, res) => {
  // Create a PaymentSession
  const request = await fetch(
    "https://api.sandbox.checkout.com/payment-sessions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(alipayHK),
    }
  );

  const parsedPayload = await request.json();

  res.status(request.status).send(parsedPayload);
});

app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`)
);
