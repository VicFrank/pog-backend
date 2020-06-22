const { query, pool } = require("../db/index");
const {
  DOTA_TEAM_GOODGUYS,
  DOTA_TEAM_BADGUYS,
  LOBBY_LOCK_TIME,
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
    WHERE (lock_time < NOW() - INTERVAL '${LOBBY_LOCK_TIME} SECONDS') IS NOT TRUE
    GROUP BY lobby_id`;
    const { rows } = await query(queryText);
    return rows;
  },

  async getLobby(lobbyID) {
    const queryText = `
    SELECT lobby_id, region, min_rank, max_rank, lobby_password,
      (lock_time < NOW() - INTERVAL '${LOBBY_LOCK_TIME} SECONDS') as locked,
      EXTRACT(EPOCH FROM NOW()) - EXTRACT(EPOCH FROM lock_time) as time_since_lock
    FROM lobbies
    WHERE lobby_id = $1
    `;
    const { rows } = await query(queryText, [lobbyID]);

    const lobby = rows[0];
    if (lobby.locked == null) {
      lobby.locked = false;
    }

    return lobby;
  },

  async isLobbyLocked(lobbyID) {
    const lobby = await this.getLobby(lobbyID);
    return false;
  },

  async lockLobby(lobbyID) {
    const queryText = `
      UPDATE lobbies SET lock_time = NOW() WHERE lobby_id = $1
    `;
    await query(queryText, [lobbyID]);
  },

  async unlockLobby(lobbyID) {
    const queryText = `
      UPDATE lobbies SET lock_time = NULL WHERE lobby_id = $1
    `;
    await query(queryText, [lobbyID]);
  },

  async setLobbyPassword(lobbyID, password) {
    const queryText = `
      UPDATE lobbies SET lobby_password = $2
      WHERE lobby_id = $1
    `;
    await query(queryText, [lobbyID, password]);
  },

  async getLobbyPlayers(lobbyID) {
    const queryText = `
    SELECT players.steam_id, team, is_host, username, avatar
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
    SELECT count(*) as size FROM lobbies JOIN lobby_players USING (lobby_id)
    WHERE lobby_id = $1
    `;
    const { rows } = await query(queryText, [lobbyID]);

    return rows[0].size;
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

  async makeLobby(steamID, avatar, region, minRank, maxRank) {
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
      lobby_players(lobby_id, steam_id, team, is_host, avatar)
      VALUES ($1, $2, $3, $4, $5)`;
      await client.query(insertPlayerText, [
        lobbyID,
        steamID,
        DOTA_TEAM_GOODGUYS,
        true,
        avatar,
      ]);

      await client.query("COMMIT");

      return lobbyID;
    } catch (e) {
      await client.query("ROLLBACK");
      throw e;
    } finally {
      client.release();
    }
  },

  async deleteLobby(lobbyID) {
    console.log(`Deleting Lobby ${lobbyID}`);
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

    const newHostSteamID = players[0].steam_id;
    await lobbyPlayers.setIsHost(newHostSteamID, true);
  },
};
