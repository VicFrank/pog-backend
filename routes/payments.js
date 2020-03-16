const express = require("express");
const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");
const router = express.Router();

const players = require("../db/players");
const auth = require("../auth/auth");
const paypalClient = require("../common/paypal-client");

router.post("/paypal/:steamid", auth.userAuth, async (req, res) => {
  try {
    const steamID = req.params.steamid;
    const orderID = req.body.orderID;
    const poggers = 10;

    let request = new checkoutNodeJssdk.orders.OrdersGetRequest(orderID);

    let order;
    try {
      order = await paypalClient.client().execute(request);
    } catch (error) {
      console.error(error);
      return res.send(500);
    }

    const money = order.result.purchase_units[0].amount.value;

    // log the transaction in the database

    // add the poggers to the player
    await players.modifyPoggers(steamID, poggers);

    res.status(200).send({ message: `Payment approved` });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
