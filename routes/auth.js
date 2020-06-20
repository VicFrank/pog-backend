var express = require("express"),
  router = express.Router(),
  passport = require("passport");

const players = require("../db/players");
const keys = require("../config/keys");

const { patreon, oauth } = require("patreon");
const { getPatrons } = require("../common/patreon");

const CLIENT_ID = keys.patreon.oauth.clientID;
const SECRET = keys.patreon.oauth.secret;
const SCOPE = `users`;
let REDIRECT_URL = process.env.IS_PRODUCTION
  ? "https://www.pathofguardians.com/api/auth/patreon/callback"
  : "http://localhost:8080/api/auth/patreon/callback";

const oauthClient = oauth(CLIENT_ID, SECRET);

router.get("/patreon", (req, res) => {
  const redirect_uri = `&redirect_uri=${REDIRECT_URL}`;
  const scope = SCOPE ? `&scope=${SCOPE}` : "";
  const client_id = `&client_id=${CLIENT_ID}`;
  const redirect = `https://www.patreon.com/oauth2/authorize?response_type=code${redirect_uri}${scope}${client_id}`;
  res.redirect(redirect);
});

router.get("/patreon/callback", async (req, res) => {
  const code = req.query.code;

  if (!code) return res.json({ error: "User denied authentication." });

  const tokens = await oauthClient.getTokens(code, REDIRECT_URL);
  const { access_token } = tokens;

  try {
    const patreonAPIClient = patreon(access_token);
    const rawData = await patreonAPIClient("/current_user");
    const data = rawData.rawJson.data;

    if (data.error) {
      return res.send(data.error.message);
    }

    const patronID = data.id;
    const patrons = await getPatrons();

    console.log(patronID);

    // check if the user is pledged to our patreon
    const isPledged = patrons.some((data) => data.id == patronID);
    if (isPledged) {
      // Add the patreon items to the user
      const steamID = req.user.id;
      let cosmeticID = "carty";
      let hasCosmetic = await players.hasCosmetic(steamID, cosmeticID);
      if (!hasCosmetic) {
        await players.giveCosmetic(steamID, cosmeticID);
      }
      cosmeticID = "emblem1";
      hasCosmetic = await players.hasCosmetic(steamID, cosmeticID);
      if (!hasCosmetic) {
        await players.giveCosmetic(steamID, cosmeticID);
        await players.equipCosmetics(steamID, cosmeticID, true);
      }
      return res.redirect("/patreon/success");
    } else {
      return res.redirect("/patreon/failure");
    }
  } catch (error) {
    console.log(error);
    return res.json(error);
  }
});

// get the current logged in user
router.get("/steam/success", (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: "User has successfully authenticated",
      user: req.user,
      cookies: req.cookies,
    });
  } else {
    res.json({
      success: false,
      message: "User has not logged in",
    });
  }
});

// GET /auth/steam
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  The first step in Steam authentication will involve redirecting
//   the user to steamcommunity.com.  After authenticating, Steam will redirect the
//   user back to this application at /auth/steam/return
router.get(
  "/steam",
  passport.authenticate("steam", { failureRedirect: "/" }),
  function (req, res) {
    res.redirect("/");
  }
);

router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

// GET /auth/steam/return
//   Use passport.authenticate() as route middleware to authenticate the
//   request.  If authentication fails, the user will be redirected back to the
//   login page.  Otherwise, the user will be redirected to their profile
router.get(
  "/steam/return",
  // Issue #37 - Workaround for Express router module stripping the full url, causing assertion to fail
  function (req, res, next) {
    req.url = req.originalUrl;
    next();
  },
  passport.authenticate("steam", { failureRedirect: "/" }),
  function (req, res) {
    if (process.env.IS_PRODUCTION) {
      return res.redirect(`/redirect`);
    } else {
      return res.redirect(`http://localhost:8080/redirect`);
    }
  }
);

module.exports = router;
