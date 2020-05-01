const express = require("express");
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");
const router = express.Router();

const players = require("../db/players");
const logs = require("../db/logs");
const cosmetics = require("../db/cosmetics");
const auth = require("../auth/auth");
const {
  cheapPaypalClient,
  expensivePaypalClient,
} = require("../common/paypal-client");
const stripeClient = require("../common/stripe-client");
const keys = require("../config/keys");

let stripeWebhookSecret;
if (process.env.IS_PRODUCTION) {
  stripeWebhookSecret = keys.stripe.production.webhook;
} else {
  stripeWebhookSecret = keys.stripe.dev.webhook;
}

router.post("/paypal/:steamid", auth.userAuth, async (req, res) => {
  try {
    const steamID = req.params.steamid;
    const orderID = req.body.orderID;
    const itemID = req.body.itemID;
    const paypalType = req.body.paypalType;

    let request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);

    let paypalClient;
    if (paypalType === "cheap") {
      paypalClient = cheapPaypalClient;
    } else if (paypalType === "expensive") {
      paypalClient = expensivePaypalClient;
    } else {
      return res.status(400).send({ message: "Didn't clarify paypal client" });
    }

    // send paypal the order ID
    let order;
    try {
      order = await paypalClient().execute(request);
      await logs.addTransactionLog(steamID, "paypal_intent", {
        itemID,
        order,
      });
    } catch (error) {
      console.error(error);
      return res.send(500);
    }

    // Make sure this is a valid player
    const playerExists = await players.doesPlayerExist(steamID);
    if (!playerExists) {
      return res.status(400).send({ message: "Invalid SteamID" });
    }

    // make sure this is a valid payment
    // this returns a float, so round
    const paidAmount = Math.floor(order.result.purchase_units[0].amount.value);
    const itemData = await cosmetics.getItemPrice(itemID);
    const { cost_usd, reward, item_type } = itemData;

    if (!itemData) {
      return res.status(400).send({ message: "Invalid ItemID" });
    }
    if (paidAmount != cost_usd) {
      return res.status(400).send({ message: "Invalid Payment" });
    }
    const validReward = item_type === "POGGERS" || item_type === "XP";
    if (!validReward) {
      return res.status(400).send({ message: "Invalid Item Type" });
    }

    // Call PayPal to capture the order
    request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
      const capture = await paypalClient().execute(request);
      await logs.addTransactionLog(steamID, "paypal", {
        itemID,
        capture,
      });
    } catch (err) {
      console.error(err);
      return res.send(500);
    }

    if (item_type === "POGGERS") {
      // add the poggers to the player
      await players.modifyPoggers(steamID, reward);
    } else if (item_type === "XP") {
      await players.addBattlePassExp(steamID, reward);
    } else {
      return res
        .status(400)
        .send({ message: "I don't know what to do with this" });
    }

    res.status(200).send({ message: `Payment Success` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.post("/stripe/intents", async (req, res) => {
  const { name, amount } = req.body;
  const steamID = req.params.steamid;

  const paymentIntent = await stripeClient.client.paymentIntents.create({
    amount,
    currency: "usd",
    payment_method_types: ["card"],
    metadata: { uid: steamID },
  });

  res.send(paymentIntent);
});

router.post("/stripe/webhook", async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let secret;
  if (process.env.IS_PRODUCTION) {
    secret = keys.stripe.production.webhook;
  } else {
    secret = keys.stripe.dev.webhook;
  }

  let event;
  try {
    event = stripeClient.client.webhooks.constructEvent(
      req.rawBody,
      sig,
      secret
    );
  } catch (err) {
    console.error(err);
    res.status(400).send("Webhook Error");
    return;
  }

  const intent = event.data.object;

  console.log(event.type);

  switch (event.type) {
    case "payment_intent.succeeded":
      console.log("Succeeded:", intent.id);
      break;
    case "payment_intent.payment_failed":
      const message =
        intent.last_payment_error && intent.last_payment_error.message;
      console.log("Failed:", intent.id, message);
      break;
  }

  res.sendStatus(200);
});

module.exports = router;
