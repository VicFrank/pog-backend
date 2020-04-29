const express = require("express");
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");
const router = express.Router();

const players = require("../db/players");
const logs = require("../db/logs");
const cosmetics = require("../db/cosmetics");
const auth = require("../auth/auth");
const paypalClient = require("../common/paypal-client");

router.post("/paypal/:steamid", auth.userAuth, async (req, res) => {
  try {
    const steamID = req.params.steamid;
    const orderID = req.body.orderID;
    const itemID = req.body.itemID;

    let request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);

    // send paypal the order ID
    let order;
    try {
      order = await paypalClient.client().execute(request);
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

    // Call PayPal to capture the order
    request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    try {
      const capture = await paypalClient.client().execute(request);
      await logs.addTransactionLog(steamID, "paypal", {
        steamID,
        orderID,
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

module.exports = router;
