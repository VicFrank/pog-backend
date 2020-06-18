const express = require("express");
const router = express.Router();
const apicache = require("apicache");

const { getPatrons } = require("../common/patreon");

const cache = apicache.middleware;

router.get("/", cache("1 hour"), async (req, res) => {
  try {
    const pledges = await getPatrons();
    res.json(pledges);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Sever Error" });
  }
});

module.exports = router;
