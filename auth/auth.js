const keys = require("../config/keys");

function checkServerKey(req) {
  const server_key = req.get("X-Dota-Server-Key");
  const dedicatedServerKey = process.env.IS_PRODUCTION
    ? keys.dedicatedServerKey
    : keys.toolsKey;

  return server_key === dedicatedServerKey;
}

module.exports = {
  adminAuth: function(req, res, next) {
    if (checkServerKey(req)) {
      return next();
    } else {
      res
        .status(403)
        .send({ message: `You are not authorized to add/change data` });
      return;
    }
  },
  userAuth: function(req, res, next) {
    if (checkServerKey(req)) {
      return next();
    }
    if (req.isAuthenticated()) {
      // ensure the user matches
      const steamid = req.params.steamid;
      if (steamid === req.user.id) {
        return next();
      }
    }
    res.status(401).send({ message: "Not Authorized" });
  },
};
