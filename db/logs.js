const { query } = require("./index");

module.exports = {
  async addTransactionLog(steamID, type, transaction) {
    try {
      const sql_query = `
      INSERT INTO player_logs (steam_id, log_event, log_data)
      VALUES ($1, $2, $3)
      `;
      const { rows } = await query(sql_query, [steamID, type, transaction]);
    } catch (error) {
      throw error;
    }
  },
};
