const express = require("express");
const axios = require("axios");
const app = express();
const WebSocket = require("ws");
const crypto = require("crypto");
const dotenv = require("dotenv");
dotenv.config();

// First method: Apply for authentication when establishing a connection.
const api_key = process.env.api_key;
const secret = process.env.secret;
// const timestamp = Date.now();
// const symbol = "BTCUSDT";
// const query = `api_key=${api_key}&symbol=${symbol}&timestamp=${timestamp}`;
// // const sign = crypto.createHmac("sha256", secret).update(query).digest("hex");
// axios
//   .get("http://api-testnet.bybit.com/public/linear/risk-limit?symbol=BTCUSDT")
//   .then((res) => {
//     console.log(res.data);
//   })
//   .catch((err) => {
//     console.error(err);
//   });

const wsUrl = "wss://stream-testnet.bybit.com/realtime_private";
// A UNIX timestamp after which the request become invalid. This is to prevent replay attacks.
// unit:millisecond
const expires = Date.now() + 10000;
// Signature
const signature = crypto
  .createHmac("sha256", secret)
  .update("GET/realtime" + expires)
  .digest("hex");

// Parameters string
const param = `api_key=${api_key}&expires=${expires}&signature=${signature}`;

// Establishing connection
const ws = new WebSocket(wsUrl + "?" + param);
ws.on("open", () => {
  console.log("opend " + new Date());
  ws.send('{"op": "subscribe", "args": ["stop_order"]}');
  ws.send('{"op": "subscribe", "args": ["execution"]}');
  ws.send('{"op": "subscribe", "args": ["order"]}');
  ws.send('{"op": "subscribe", "args": ["position"]}');
  setInterval(() => {
    console.log("heart beat ..");
    ws.send('{"op":"ping"}');
  }, 35000);
});
ws.on("message", (msg) => {
  console.log("----------------^^^^^^^^^^^^^^^^^^^^^^-------------------", msg);
});

ws.on("update", function (message) {
  console.log("update^^^^^^^^^^^^^^", message);
});

ws.on("response", function (response) {
  console.log("response", response);
});

ws.on("close", function () {
  console.log("connection closed " + new Date());
});

ws.on("error", function (err) {
  console.error("ERR", err);
});
// // Second method: Apply for authentication after establishing a connection through auth request.

// const ws = new WebSocket(wsUrl);
// Signature is the same for both methods of authentication
// ws.on("open", () => {
//   console.log("opened");

//   ws.send(`{"op":"auth","args":["${api_key}","${expires}","${signature}"]}`);
// });

// ws.on("message", (msg) => {
//   console.log(msg);
// });

ws.on("error", (err) => {
  console.error(err);
});

module.exports = app;
