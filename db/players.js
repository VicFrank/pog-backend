const { query } = require("./index");

module.exports = {
  async getAllPlayers(limit = 100, offset = 0) {
    try {
      const sql_query = `
      SELECT p.*, count(*) as games
        FROM players as p
        JOIN game_players as gp
        USING (steam_id)
        GROUP BY p.steam_id
        ORDER BY games DESC
        LIMIT $1 OFFSET $2
      `;
      const { rows } = await query(sql_query, [limit, offset]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getPlayerBySteamID(steamID) {
    try {
      const sql_query = `
      SELECT p.*, count(*) as games,
      COUNT(DISTINCT(case when g.radiant_win = gp.is_radiant then g.game_id end)) as wins
        FROM players as p
        JOIN game_players as gp
        USING (steam_id)
        JOIN games as g
        USING (game_id)
        WHERE steam_id = $1 AND
          ranked = True
        GROUP BY p.steam_id
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
};
