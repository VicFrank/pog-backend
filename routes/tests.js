const express = require("express");
const router = express.Router();
const games = require("../db/games");

const {
  sampleData,
  generateRandomSampleData,
} = require("../testing/sample-data");

router.get("/sample", async (req, res) => {
  try {
    // const parsedData = JSON.parse(sampleData);
    const insertedGameID = await games.create(sampleData.gameStats);
    res.status(201).send({ message: `Created game with ID ${insertedGameID}` });
  } catch (error) {
    // console.log(req.body.data);
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

router.get("/random_sample", async (req, res) => {
  try {
    const insertedGameID = await games.create(generateRandomSampleData());
    res.status(201).send({ message: `Created game with ID ${insertedGameID}` });
  } catch (error) {
    // console.log(req.body.data);
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
