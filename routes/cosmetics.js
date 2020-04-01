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

module.exports = router;
