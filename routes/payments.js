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

router.post("/paypal/:steamid", auth.userAuth, async (req, res) => {
  try {
    const steamID = req.params.steamid;
    const orderID = req.body.orderID;
    const itemID = req.body.itemID;
    const paypalType = req.body.paypalType;

    console.log("Start of Post");

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
      console.log(error);
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
      console.log(err);
      return res.send(500);
    }

    if (item_type === "POGGERS") {
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
  const { name, amount, steamID } = req.body;

  const itemData = await cosmetics.getItemPrice(name);
  const { cost_usd, item_type } = itemData;

  if (!itemData) {
    return res.status(400).send({ message: "Invalid ItemID" });
  }
  if (amount / 100 != cost_usd) {
    return res.status(400).send({ message: "Invalid Payment Amount" });
  }
  const validReward = item_type === "POGGERS" || item_type === "XP";
  if (!validReward) {
    return res.status(400).send({ message: "Invalid Item Type" });
  }

  const paymentIntent = await stripeClient.client.paymentIntents.create({
    amount,
    currency: "usd",
    payment_method_types: ["card"],
    metadata: { steamID, itemID: name },
  });

  res.send(paymentIntent);
});

async function handleStripePaymentIntentSucceeded(intent) {
  const { steamID, itemID } = intent.metadata;
  const itemData = await cosmetics.getItemPrice(itemID);
  const { item_type, reward } = itemData;

  await logs.addTransactionLog(steamID, "stripe", {
    intent,
  });

  try {
    if (item_type === "POGGERS") {
      await players.modifyPoggers(steamID, reward);
    } else if (item_type === "XP") {
      await players.addBattlePassExp(steamID, reward);
    } else {
      throw new Error("Bad item type");
    }
  } catch (error) {
    console.log(error);
  }
}

async function handleStripeSourceChargeable(intent) {
  const { amount, id, currency } = intent;
  const { itemID } = intent.metadata;
  const isValid = await isValidStripeTransaction(itemID, amount);
  if (isValid) {
    await logs.addTransactionLog(steamID, "alipay", {
      intent,
    });

    stripeClient.client.charges.create({
      amount: amount,
      currency: currency,
      source: id,
      metadata: intent.metadata,
    });
  }
}

async function isValidStripeTransaction(itemID, amount) {
  const itemData = await cosmetics.getItemPrice(itemID);
  const { cost_usd, item_type } = itemData;
  const validReward = item_type === "POGGERS" || item_type === "XP";

  if (!itemData || amount / 100 != cost_usd || !validReward) {
    return false;
  }

  return true;
}

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
    console.log(err);
    res.status(400).send("Webhook Error");
    return;
  }

  const intent = event.data.object;

  switch (event.type) {
    case "payment_intent.succeeded":
      handleStripePaymentIntentSucceeded(intent);
      break;
    case "payment_intent.payment_failed":
      const message =
        intent.last_payment_error && intent.last_payment_error.message;
      console.log("Failed:", intent.id, message);
      break;
    case "source.chargeable":
      // make a charge request
      handleStripeSourceChargeable(intent);
      break;
    case "charge.succeeded":
      // Alipay charge success, give them their stuff
      handleStripePaymentIntentSucceeded(intent);
      break;
  }

  res.json({ received: true });
});

module.exports = router;
