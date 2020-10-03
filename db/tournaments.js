const { query } = require("./index");

module.exports = {
  async endTournament() {
    try {
      await query("UPDATE players SET in_tournament = FALSE");
    } catch (error) {
      throw error;
    }
  },
};
