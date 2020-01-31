const keys = require("../config/keys");

module.exports = {
  isFromDedicatedServer: function(req, res, next) {
    const server_key = req.get("X-Dota-Server-Key");
    const dedicatedServerKey = process.env.IS_PRODUCTION
      ? keys.dedicatedServerKey
      : keys.toolsKey;

    if (server_key === dedicatedServerKey) {
      return next();
    } else {
      res
        .status(403)
        .send({ message: `You are not authorized to add/change data` });
      return;
    }
  },
};
