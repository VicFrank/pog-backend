const express = require("express");
const router = express.Router();
const axios = require("axios");
const apicache = require("apicache");

const keys = require("../config/keys");
const cache = apicache.middleware;

router.get("/", cache("1 hour"), async (req, res) => {
  const oauth = keys.paypal.oauth;
  const cursor = req.query.cursor;
  let cursorExtension = "";
  if (cursor) {
    cursorExtension = `&page%5Bcursor%5D=${cursor}`;
  }

  try {
    let request;
    try {
      request = await axios.get(
        `https://www.patreon.com/api/oauth2/api/campaigns/2587720/pledges?page%5Bcount%5D=100&sort=created${cursorExtension}`,
        { headers: { Authorization: `Bearer ${oauth.accessToken}` } }
      );
    } catch (error) {
      if (error.response) {
        console.log(error.response.data);
        const { status, detail } = error.response.data.errors[0];
        return res.status(status).send({ message: detail });
      }
      return res.status(500).send({ message: "Bad internal request" });
    }

    const { data } = request;
    const userData = {};
    const pledges = [];
    let nextCursor;
    if (data.links.next) {
      nextCursor = data.links.next.split("&page%5Bcursor%5D=")[1];
    }

    for (const reference of data.included) {
      if (reference.type === "user") {
        const id = reference.id;
        const name = reference.attributes.full_name;
        userData[id] = name;
      }
    }

    for (const pledge of data.data) {
      if (pledge.type === "pledge") {
        const amount = pledge.attributes.amount_cents;
        const patronID = pledge.relationships.patron.data.id;
        const name = userData[patronID];

        let level = 0;

        if (amount >= 1000) {
          level = 3;
        } else if (amount >= 500) {
          level = 2;
        } else {
          level = 1;
        }

        pledges.push({
          name,
          level,
        });
      }
    }
    res.json({
      pledges,
      meta: data.meta,
      next: nextCursor,
    });
  } catch (error) {
    return res.status(500).send({ message: "Sever Error" });
  }
});

module.exports = router;
