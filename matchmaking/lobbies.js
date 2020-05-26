const { query, pool } = require("../db/index");
const {
  DOTA_TEAM_GOODGUYS,
  DOTA_TEAM_BADGUYS,
} = require("../common/constants");
const lobbyPlayers = require("./lobby-players");

module.exports = {
  async getAllLobbies() {
    const queryText = `
    SELECT lobby_id, region, min_rank, max_rank,
      count(*) as lobbySize
    FROM lobbies
    JOIN lobby_players
    USING (lobby_id)
    GROUP BY lobby_id`;
    const { rows } = await query(queryText);
    return rows;
  },

  async getLobby(lobbyID) {
    const queryText = `
    SELECT * FROM lobbies
    WHERE lobby_id = $1
    `;
    const { rows } = await query(queryText, [lobbyID]);

    return rows[0];
  },

  async getLobbyPlayers(lobbyID) {
    const queryText = `
    SELECT players.steam_id, team, is_host, username
    FROM lobby_players
    JOIN players
    USING (steam_id)
    WHERE lobby_id = $1
    `;
    const { rows } = await query(queryText, [lobbyID]);

    return rows;
  },

  async getDetailedLobby(lobbyID) {
    const lobby = await this.getLobby(lobbyID);
    const lobbyPlayers = await this.getLobbyPlayers(lobbyID);

    return {
      ...lobby,
      lobbyPlayers,
    };
  },

  async getLobbySize(lobbyID) {
    const queryText = `
    SELECT count(*) FROM lobbies JOIN lobby_players USING (lobby_id)
    WHERE lobby_id = $1
    `;
    const { rows } = await query(queryText, [lobbyID]);

    return rows[0];
  },

  async getNumPlayersOnTeam(lobbyID, team) {
    const queryText = `
    SELECT count(*) FROM lobbies JOIN lobby_players USING (lobby_id)
    WHERE lobby_id = $1 AND team = $2
    `;
    const { rows } = await query(queryText, [lobbyID, team]);

    return rows[0];
  },

  async isFull(lobbyID) {
    const lobbySize = await this.getLobbySize(lobbyID);
    return lobbySize >= 6;
  },

  async makeLobby(steamID, region, minRank, maxRank) {
    const client = await pool.connect();
    try {
      await client.query("BEGIN");

      // Create the lobby
      const queryText = `
      INSERT INTO
      lobbies(region, min_rank, max_rank)
      VALUES($1, $2, $3)
      RETURNING lobby_id`;
      const res = await client.query(queryText, [region, minRank, maxRank]);
      const lobbyID = res.rows[0].lobby_id;

      // Insert the player as host
      const insertPlayerText = `
      INSERT INTO
      lobby_players(lobby_id, steam_id, team, is_host)
      VALUES ($1, $2, $3, $4)`;
      await client.query(insertPlayerText, [
        lobbyID,
        steamID,
        DOTA_TEAM_GOODGUYS,
        true,
      ]);

      await client.query("COMMIT");
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  },

  async deleteLobby(lobbyID) {
    let queryText = `DELETE FROM lobby_players WHERE lobby_id = $1`;
    await query(queryText, [lobbyID]);
    queryText = `DELETE FROM lobbies WHERE lobby_id = $1`;
    await query(queryText, [lobbyID]);
  },

  async updateHost(lobbyID) {
    const players = await this.getLobbyPlayers(lobbyID);
    // Make sure there isn't already a host
    for (const player of players) {
      if (player.is_host) return;
    }

    const newHostSteamID = players[0].steamID;
    await lobbyPlayers.setIsHost(newHostSteamID, true);
  },
};
