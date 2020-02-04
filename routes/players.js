const express = require("express");
const router = express.Router();
const players = require("../db/players");
const apicache = require("apicache");
const { isFromDedicatedServer } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const playerInfo = await players.getAllPlayers(limit, offset);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamid", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const playerExists = await players.doesPlayerExist(steamid);
    if (!playerExists) {
      res.status(404).send({ message: "Player not found" });
      return;
    }
    const playerInfo = await players.getPlayer(steamid);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

// Item Transactions
router.post("/:steamid", isFromDedicatedServer, async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const { itemTransaction } = JSON.parse(JSON.stringify(req.body));
    const playerExists = await players.doesPlayerExist(steamid);
    if (!playerExists) {
      res.status(404).send({ message: "Player not found" });
      return;
    }
    await players.itemTransaction(steamid, itemTransaction);
    res.status(200).send({ message: "Transaction Complete" });
  } catch (error) {
    // console.log(error);
    res
      .status(500)
      .json({ message: "Transaction Failed", error: error.toString() });
  }
});

router.get("/:steamid/heroes", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const playerInfo = await players.getHeroStats(steamid);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamid/companions", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const playerInfo = await players.getCompanions(steamid);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamid/equipped_companion", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const rows = await players.getEquippedCompanion(steamid);
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post(
  "/:steamid/equipped_companion",
  isFromDedicatedServer,
  async (req, res) => {
    try {
      const steamid = req.params.steamid;
      const companion = req.params.companion;
      const rows = await players.setCompanion(steamid, companion);
      res.status(200).json(rows);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Server Error" });
    }
  }
);

router.get("/:steamid/cosmetics", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const filter = req.query.filter;
    const onlyEquipped = filter === "equipped";
    console.log(onlyEquipped);
    const playerInfo = await players.getPlayerCosmetics(steamid, onlyEquipped);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.put(
  "/:steamid/cosmetics/:cosmetic_id/equip",
  isFromDedicatedServer,
  async (req, res) => {
    try {
      const cosmetic_id = req.params.cosmetic_id;
      const playerInfo = await players.equipCosmetics(cosmetic_id, true);
      res.status(200).json(playerInfo);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Server Error" });
    }
  }
);

router.delete(
  "/:steamid/cosmetics/:cosmetic_id/equip",
  isFromDedicatedServer,
  async (req, res) => {
    try {
      const cosmetic_id = req.params.cosmetic_id;
      const playerInfo = await players.equipCosmetics(cosmetic_id, false);
      res.status(200).json(playerInfo);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Server Error" });
    }
  }
);

module.exports = router;
