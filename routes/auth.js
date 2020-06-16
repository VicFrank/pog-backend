var express = require("express"),
  router = express.Router(),
  passport = require("passport");

const players = require("../db/players");
const keys = require("../config/keys");

const PatreonOAuth = require("patreon-oauth");

const SCOPE = `identity.memberships`;
let REDIRECT_URL = "http://localhost:8080/api/auth/patreon/callback";
if (process.env.IS_PRODUCTION) {
  REDIRECT_URL = "/api/auth/patreon/callback";
} else {
  REDIRECT_URL = "http://localhost:8080/api/auth/patreon/callback";
}
const patreon = new PatreonOAuth(
  keys.patreon.oauth.clientID,
  keys.patreon.oauth.secret,
  SCOPE,
  REDIRECT_URL
);

router.get("/patreon", (req, res) => {
  res.redirect(patreon.AUTH_URL);
});

router.get("/patreon/callback", async (req, res) => {
  patreon.handle(req, async (data) => {
    if (data.error) {
      res.send(data.error.message);
      return;
    }
    // check if the user is pledged to our patreon
    const POG_PATREON_ID = "43728448";
    const pledges = data.relationships.pledges.data;
    const isPledged = pledges.some((data) => data.id == POG_PATREON_ID);
    if (isPledged) {
      // Add the patreon items to the user
      const steamID = req.user.id;
      const cosmeticID = "carty";
      const hasCosmetic = await players.hasCosmetic(steamID, cosmeticID);
      if (!hasCosmetic) {
        await players.giveCosmetic(steamID, cosmeticID);
      }
      return res.redirect("/patreon/success");
    } else {
      return res.redirect("/patreon/failure");
    }
  });
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
