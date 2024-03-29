const express = require("express");
const router = express.Router();
const games = require("../db/games");
const auth = require("../auth/auth");
const apicache = require("apicache");

let cache = apicache.middleware;

router.get("/", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;
    const pastHours = parseInt(req.query.hours);
    if (pastHours) {
      const gameInfo = await games.getGames(limit, offset, pastHours);
      res.status(200).json(gameInfo);
    } else {
      const gameInfo = await games.getGames(limit, offset);
      res.status(200).json(gameInfo);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.post("/", auth.adminAuth, async (req, res) => {
  try {
    const parsedData = JSON.parse(JSON.stringify(req.body));
    const insertedGameID = await games.create(parsedData);
    res.status(201).send({ message: `Created game with ID ${insertedGameID}` });
  } catch (error) {
    console.log(JSON.stringify(req.body));
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/:gameid", cache("1 hour"), async (req, res) => {
  try {
    const gameid = parseInt(req.params.gameid);
    const gameInfo = await games.getGameByID(gameid);
    const teamInfo = await games.getTeamsByGameID(gameid);
    const playerInfo = await games.getPlayersByGameID(gameid);

    const result = {
      gameInfo,
      teamInfo,
      playerInfo,
    };
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/stats/heroes", cache("1 hour"), async (req, res) => {
  try {
    const heroStats = await games.getHeroStats();

    res.status(200).json(heroStats);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/stats/heroes/day", async (req, res) => {
  try {
    const heroStats = await games.getHeroStats(24);

    res.status(200).json(heroStats);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/stats/heroes/week", async (req, res) => {
  try {
    const heroStats = await games.getHeroStats(168);

    res.status(200).json(heroStats);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/stats/heroes/month", cache("1 hour"), async (req, res) => {
  try {
    const heroStats = await games.getHeroStats(5208);

    res.status(200).json(heroStats);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
