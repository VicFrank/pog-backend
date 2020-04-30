const express = require("express");
const router = express.Router();
const auth = require("../auth/auth");
const playerLogs = require("../db/logs");

router.get("/patreon", auth.adminAuth, async (req, res) => {
  try {
    const logs = await playerLogs.getLogsOfType("paypal");
    res.status(201).send(logs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.toString() });
  }
});

module.exports = router;
