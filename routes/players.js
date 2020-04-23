const express = require("express");
const router = express.Router();
const players = require("../db/players");
const quests = require("../db/quests");
const auth = require("../auth/auth");

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

//////////////////////////////////////////////
// Player Stats
//////////////////////////////////////////////

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

router.get("/:steamid/games", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const limit = req.query.limit;
    const recentMatches = await players.getGames(steamid, limit);
    res.status(200).json(recentMatches);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
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

//////////////////////////////////////////////
// Quests / Achievements
//////////////////////////////////////////////

router.get("/:steamid/daily_quests", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const dailyQuests = await quests.getDailyQuestsForPlayer(steamid);
    res.status(200).json(dailyQuests);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

// /api/players/:steamid/daily_quests/reroll?questID=:questid
router.post(
  "/:steamid/daily_quests/reroll",
  auth.userAuth,
  async (req, res) => {
    try {
      const steamid = req.params.steamid;
      const questID = req.query.questID;
      const dailyQuests = await quests.rerollDailyQuest(steamid, questID);
      res.status(200).json(dailyQuests);
    } catch (error) {
      console.log(error);
      res.status(500).json(error.toString());
    }
  }
);

// /api/players/:steamid/daily_quests/claim?questID=:questid
router.post("/:steamid/daily_quests/claim", auth.userAuth, async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const questID = req.query.questID;
    const rewards = await quests.claimQuestReward(steamid, questID);
    res.status(200).json(rewards);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.get("/:steamid/achievements", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const dailyQuests = await quests.getActiveAchievementsForPlayer(steamid);
    res.status(200).json(dailyQuests);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

// /api/players/:steamid/daily_quests/claim?questID=:questid
router.post("/:steamid/achievements/claim", auth.userAuth, async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const questID = req.query.questID;
    const rewards = await quests.claimQuestReward(steamid, questID);
    res.status(200).json(rewards);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.toString() });
  }
});

//////////////////////////////////////////////
// Transactions
//////////////////////////////////////////////

router.post("/:steamid/transaction", auth.userAuth, async (req, res) => {
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

//////////////////////////////////////////////
// Companions / Cosmetics / Battle Pass
//////////////////////////////////////////////

router.get("/:steamid/companions", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const companions = await players.getCompanions(steamid);
    res.status(200).json(companions);
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

router.post("/:steamid/equipped_companion", auth.userAuth, async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const { companionID } = JSON.parse(JSON.stringify(req.body));
    const rows = await players.setCompanion(steamid, companionID);
    res.status(200).json(rows);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:steamid/cosmetics", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const filter = req.query.filter;
    const onlyEquipped = filter === "equipped";
    const playerInfo = await players.getAllCosmetics(steamid, onlyEquipped);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post(
  "/:steamid/cosmetics/:cosmetic_id/equip",
  auth.userAuth,
  async (req, res) => {
    try {
      const cosmetic_id = req.params.cosmetic_id;
      const equip = req.query.equip == "true";
      const playerInfo = await players.equipCosmetics(cosmetic_id, equip);
      res.status(200).json(playerInfo);
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Server Error" });
    }
  }
);

router.put(
  "/:steamid/cosmetics/:cosmetic_id/equip",
  auth.userAuth,
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
  auth.userAuth,
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

router.get("/:steamid/battle_pass", async (req, res) => {
  try {
    const steamid = req.params.steamid;
    const playerInfo = await players.getBattlePasses(steamid);
    res.status(200).json(playerInfo);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
