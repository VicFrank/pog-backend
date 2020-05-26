const { query } = require("../db/index");
const {
  DOTA_TEAM_GOODGUYS,
  DOTA_TEAM_BADGUYS,
} = require("../common/constants");

module.exports = {
  async getLobby(steamID) {
    try {
      const sql_query = `
      SELECT * FROM lobbies JOIN lobby_players USING (lobby_id)
      WHERE steam_id = $1
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  },

  async getPlayer(steamID) {
    const sql_query = `
    SELECT * FROM players JOIN lobby_players USING (steam_id)
    WHERE steam_id = $1
    `;
    const { rows } = await query(sql_query, [steamID]);
    return rows[0];
  },

  async joinLobby(steamID, lobbyID, team, avatar) {
    const queryText = `
    INSERT INTO lobby_players
    (steam_id, lobby_id, team, avatar)
    VALUES ($1, $2, $3, $4)
    `;
    await query(queryText, [steamID, lobbyID, team, avatar]);
  },

  async leaveLobby(steamID) {
    const queryText = `DELETE FROM lobby_players WHERE steam_id = $1`;
    await query(queryText, [steamID]);
  },

  async changeTeam(steamID, team) {
    const queryText = `UPDATE lobby_players SET team = $2 WHERE steam_id = $1`;
    await query(queryText, [steamID, team]);
  },

  async setIsHost(steamID, isHost) {
    const queryText = `UPDATE lobby_players SET is_host = $2 WHERE steam_id = $1`;
    await query(queryText, [steamID, isHost]);
  },
};
