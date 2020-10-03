const express = require("express");
const router = express.Router();
const axios = require("axios");

const keys = require("../config/keys");
const players = require("../db/players");
const tournaments = require("../db/tournaments");

router.get("/ResolveVanityURL", async (req, res) => {
  try {
    const vanity = req.query.vanity;
    let request;
    try {
      request = await axios.get(
        `http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${keys.steamAPIKey}&vanityurl=${vanity}`
      );
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
      }
      throw error;
    }
    const { data } = request;

    res.status(201).send({ data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.post("/enter", async (req, res) => {
  try {
    const steamIDs = JSON.parse(JSON.stringify(req.body));

    await players.enterTournament(steamIDs);
    res.status(201).send({ message: "Entered Tournament" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

router.post("/end", async (req, res) => {
  try {
    await tournaments.endTournament();
    res.status(201).send({ message: "Tournament ended" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
