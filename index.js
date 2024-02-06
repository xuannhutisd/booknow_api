import cors from "cors";
import express from "express";
import bodyParser from "body-parser";
require("dotenv").config();
//Tạo server với express
var app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send(`Hello, world!!! ${PORT}`);
});
// Create the endpoint for your webhook
app.post("/webhook", (req, res) => {
  let body = req.body;

  console.log(`\u{1F7EA} Received webhook:`);

  // Send a 200 OK response if this is a page webhook
  if (body.object === "page") {
    body.entry.forEach(function (entry) {
      // Gets the body of the webhook event
      let webhook_event = entry.messaging[0];
      console.log("--------webhook_event0", webhook_event);
      console.log("--------webhook_event1", webhook_event.nlp.intents);
      console.log("--------webhook_event2", webhook_event.nlp.entities);
      console.log("--------webhook_event3", webhook_event.nlp.traits);
      console.log("--------webhook_event4", webhook_event.nlp.detected_locales);

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      console.log("-------Sender PSID: " + sender_psid);
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send("EVENT_RECEIVED");

    // Determine which webhooks were triggered and get sender PSIDs and locale, message content and more.
  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }
});
// Add support for GET requests to our webhook
app.get("/webhook", (req, res) => {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;

  // Parse the query params
  let mode = req.query["hub.mode"];
  let token = req.query["hub.verify_token"];
  let challenge = req.query["hub.challenge"];

  // Check if a token and mode is in the query string of the request
  if (mode && token) {
    // Check the mode and token sent is correct
    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      // Respond with the challenge token from the request
      console.log("WEBHOOK_VERIFIED");
      res.status(200).send(challenge);
    } else {
      // Respond with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

// Handles messages events
function handleMessage(sender_psid, received_message) {}

// Handles messaging_postbacks events
function handlePostback(sender_psid, received_postback) {}

// Sends response messages via the Send API
function callSendAPI(sender_psid, response) {}
// Khởi tạo server tại port
app.listen(PORT);
console.log(`Running server at http://localhost:${PORT}`);
