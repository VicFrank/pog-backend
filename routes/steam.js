const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
const apicache = require("apicache");

let cache = apicache.middleware;

router.get("/changelog", cache("5 minutes"), async (req, res) => {
  try {
    const API_URL =
      "https://www.dota2.com/webapi/IWorkshop/GetChangeLog/v0001/?fileid=2077900442";
    const request = await fetch(API_URL);
    const changes = await request.json();
    res.status(200).json(changes);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Server Error" });
  }
});

module.exports = router;
