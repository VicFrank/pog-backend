const express = require("express");
const router = express.Router();
const polls = require("../db/polls");
const auth = require("../auth/auth");

router.get("/:pollid", async (req, res) => {
  try {
    const pollID = parseInt(req.params.pollid);
    const poll = await polls.getPoll(pollID);
    const results = await polls.getPollResults(pollID);
    res.status(200).send({
      ...poll,
      results,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:pollid/:steamid", auth.userAuth, async (req, res) => {
  try {
    const pollID = parseInt(req.params.pollid);
    const steamID = req.params.steamid;

    const vote = await polls.getVoteForPlayer(steamID, pollID);

    res.status(200).send(vote);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:pollid/:steamid", auth.userAuth, async (req, res) => {
  try {
    const pollID = parseInt(req.params.pollid);
    const steamID = req.params.steamid;
    const vote = parseInt(req.query.vote);

    const hasVoted = await polls.getVoteForPlayer(steamID, pollID);

    if (hasVoted) {
      return res.status(403).send("You've already voted in this poll");
    }

    await polls.voteInPoll(steamID, pollID, vote);

    res.status(200).send("Success");
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
