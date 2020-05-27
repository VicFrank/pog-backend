var express = require("express"),
  router = express.Router(),
  passport = require("passport");

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
