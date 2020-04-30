const express = require("express");
const router = express.Router();
const cosmetics = require("../db/cosmetics");

router.get("/", async (req, res) => {
  try {
    const cosmeticsList = await cosmetics.getAllCosmetics();
    res.status(201).send(cosmeticsList);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/battle_pass", async (req, res) => {
  try {
    const battlePass = await cosmetics.getBattlePass();
    res.status(201).send(battlePass);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/item_prices", async (req, res) => {
  try {
    const prices = await cosmetics.getItemPrices();
    res.status(201).send(prices);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/item_prices/:itemid", async (req, res) => {
  try {
    const itemID = req.params.itemid;
    const price = await cosmetics.getItemPrice(itemID);
    res.status(201).send(price);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/chest_rewards", async (req, res) => {
  try {
    const rows = await cosmetics.getAllChestRewards();
    res.status(201).send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/chest_rewards/:chest_id", async (req, res) => {
  try {
    const chestID = req.params.chest_id;
    const rows = await cosmetics.getPotentialChestRewards(chestID);
    res.status(201).send(rows);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
