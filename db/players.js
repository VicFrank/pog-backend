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

  async doesPlayerExist(steamID) {
    try {
      const sql_query = `
      select exists(select 1 from players where steam_id=$1)
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows[0].exists;
    } catch (error) {
      throw error;
    }
  },

  async getPlayer(steamID) {
    try {
      const sql_query = `
      SELECT p.*,
      count(*) as games,
      COUNT(DISTINCT(case when g.radiant_win = gp.is_radiant then g.game_id end)) as wins,
      COUNT(DISTINCT(case when g.radiant_win != gp.is_radiant then g.game_id end)) as losses,
      SUM(g.duration) as time_played,
      SUM(gp.kills) as kills,
      SUM(gp.deaths) as deaths,
      SUM(gp.assists) as assists,
      SUM(gp.double_kills) as double_kills,
      SUM(gp.rampages) as rampages,
      SUM(gp.last_hits) as last_hits,
      SUM(gp.denies) as denies,
      SUM(gp.tp_used) as tp_used,
      SUM(gp.runes_used) as runes_used,
      SUM(gp.total_gold) as total_gold,
      SUM(gp.total_exp) as total_exp,
      
      TRUNC(SUM(g.duration)::decimal / count(*), 2) as avg_game_duration,
      TRUNC(SUM(gp.kills)::decimal / count(*), 2) as avg_kills,
      TRUNC(SUM(gp.deaths)::decimal / count(*), 2) as avg_deaths,
      TRUNC(SUM(gp.assists)::decimal / count(*), 2) as avg_assists,
      TRUNC(SUM(gp.last_hits)::decimal / count(*), 2) as avg_last_hits,
      TRUNC(SUM(gp.denies)::decimal / count(*), 2) as avg_denies,
      TRUNC(SUM(gp.tp_used)::decimal / count(*), 2) as avg_tp_used,
      TRUNC(SUM(gp.runes_used)::decimal / count(*), 2) as avg_runes_used,
      TRUNC(60 * SUM(gp.total_gold)::decimal / SUM(g.duration), 2) as gpm,
      TRUNC(60 * SUM(gp.total_exp)::decimal / SUM(g.duration), 2) as xpm,
      
      COUNT(case when gp.abandoned then 1 end) as abandoned
      
      --   TODO: buildings_destroyed, guardian_kills, avg_guardian_kills
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

      const teamKillStats = await this.getTeamKillStats(steamID);
      return {
        ...rows[0],
        buildings_destroyed: teamKillStats.buildingKills.buildings_destroyed,
        guardian_kills: teamKillStats.guardianKills.guardian_kills,
        avg_guardian_kills:
          teamKillStats.guardianKills.guardian_kills / parseInt(rows[0].games),
      };
    } catch (error) {
      throw error;
    }
  },

  async getTeamKillStats(steamID) {
    try {
      const building_kills_query = `
      WITH t1 as (
        SELECT *
      FROM game_players as gp
      JOIN games as g
      USING (game_id)
      JOIN teams as t
      USING (game_id, is_radiant)
      WHERE steam_id = $1 AND
        ranked = True
      ),
      num_kills as (SELECT (SELECT COUNT(*) FROM json_object_keys(t1.building_kills)) FROM t1)
      
      SELECT sum(count) buildings_destroyed FROM num_kills;
      `;
      const { rows } = await query(building_kills_query, [steamID]);
      const buildingKills = rows[0];

      const guardian_kills_query = `
      WITH t1 as (
        SELECT *
      FROM game_players as gp
      JOIN games as g
      USING (game_id)
      JOIN teams as t
      USING (game_id, is_radiant)
      WHERE steam_id = $1 AND
        ranked = True
      ),
      num_kills as (SELECT (SELECT COUNT(*) FROM json_object_keys(t1.guardian_kills)) FROM t1)
      
      SELECT sum(count) guardian_kills FROM num_kills;
      `;
      const { rows: guardianRows } = await query(guardian_kills_query, [
        steamID,
      ]);
      const guardianKills = guardianRows[0];
      return {
        buildingKills,
        guardianKills,
      };
    } catch (error) {
      throw error;
    }
  },

  async getHeroStats(steamID) {
    try {
      const sql_query = `
      SELECT gp.hero,
        count(*) as games,
        COUNT(case when g.radiant_win = gp.is_radiant then g.game_id end) as wins,
        TRUNC(SUM(gp.kills)::decimal / count(*), 2) as avg_kills,
        TRUNC(SUM(gp.deaths)::decimal / count(*), 2) as avg_deaths,
        TRUNC(SUM(gp.assists)::decimal / count(*), 2) as avg_assists
      FROM game_players gp
      JOIN games g
      USING (game_id)
      JOIN players p
      USING (steam_id)
      WHERE p.steam_id = $1
      GROUP BY gp.hero
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async addBattlePass(steamID, bpName, level, points) {
    try {
      const { rows } = await query(
        `
      INSERT INTO player_battle_pass (steam_id, bp_name, bp_level, points)
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
        [steamID, bpName, level, points]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async updateBattlePass(steamID, bpName, level, points) {
    try {
      const { rows } = await query(
        `
      UPDATE player_battle_pass
      SET bp_level = COALESCE($3, bp_level),
          points = COALESCE($4, points)
      WHERE
        steam_id = $1 AND
        bp_name = $2
      RETURNING *
      `,
        [steamID, bpName, level, points]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getBattlePasses(steamID) {
    try {
      const sql_query = `
      SELECT bp_name, bp_level, points
      FROM player_battle_pass
      WHERE steam_id = $1
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getPlayerCosmetics(steamID) {
    try {
      const sql_query = `
      SELECT cosmetic_name, effect, equipped
      FROM player_cosmetics
      WHERE steam_id = $1
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getCompanions(steamID) {
    try {
      const sql_query = `
      SELECT companion_name, companion_level, effect, amount
      FROM player_companions
      WHERE steam_id = $1
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async itemTransaction(steamID, transactionData) {
    try {
      await query("BEGIN");

      // Add and remove companions
      if (transactionData.companions) {
        const { companions } = transactionData;
        for (const companionData of companions) {
          const { name, effect, level, amount } = companionData;

          if (amount > 0) {
            // Upsert the companion
            const queryText = `
              INSERT INTO player_companions as pc
                (steam_id, companion_name, companion_level, effect, amount)
              VALUES
                ($1, $2, $3, $4, $5)
              ON CONFLICT  (steam_id, companion_name, companion_level, effect)
              DO UPDATE SET amount = pc.amount + $5
              `;
            const { rows } = await query(queryText, [
              steamID,
              name,
              level,
              effect,
              amount,
            ]);
          } else if (amount < 0) {
            const queryText = `
              UPDATE player_companions
              SET amount = amount + $1
              WHERE steam_id = $2 AND 
                companion_name = $3 AND
                companion_level = $4 AND
                effect = $5
            `;
            await query(queryText, [amount, steamID, name, level, effect]);
          }
        }
      }

      // Add or remove poggers
      if (transactionData.poggers) {
        const { poggers } = transactionData;
        const queryText = `
          UPDATE players
          SET poggers = poggers + $1
          WHERE steam_id = $2
        `;
        await query(queryText, [poggers, steamID]);
      }

      // Add or remove misc items
      if (transactionData.items) {
        const { items } = transactionData;
        const entries = Object.entries(items);

        for (const [itemName, amount] of entries) {
          if (amount > 0) {
            // Upsert (can't upsert negative amounts)
            const queryText = `
              INSERT INTO player_cosmetics as pc
                (steam_id, cosmetic_name, amount)
              VALUES
                ($1, $2, $3)
              ON CONFLICT (steam_id, cosmetic_name)
              DO UPDATE SET amount = pc.amount + $3
            `;
            await query(queryText, [steamID, itemName, amount]);
          } else if (amount < 0) {
            const queryText = `
                UPDATE player_cosmetics
                SET amount = amount + $1
                WHERE steam_id = $2 AND cosmetic_name = $3
              `;
            await query(queryText, [amount, steamID, itemName]);
          }
        }
      }

      if (transactionData.playerRequestedStatReset) {
        const { statResetDate } = transactionData; // the date in unix time
        const queryText = `
          UPDATE players
          SET last_stat_reset = to_timestamp($1)
          WHERE steam_id = $2
        `;
        await query(queryText, [statResetDate, steamID]);
      }

      await query("COMMIT");
    } catch (error) {
      await query("ROLLBACK");
      throw error;
    }
  },
};
