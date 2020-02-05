const { query } = require("./index");
const { GetEloRatingChange } = require("../mmr/mmr");

module.exports = {
  async create(gameData) {
    try {
      const {
        gameDuration,
        cheatsEnabled,
        rankedGame,
        winnerTeam,
        healthDrops,
        bannedHeroes,
        teamInfo,
        playerInfo,
      } = gameData;

      const radiantWin = winnerTeam == "DOTA_TEAM_GOODGUYS";

      const { rows: gameRows } = await query(
        `
      INSERT INTO games (radiant_win, ranked, duration, health_drops, cheats_enabled)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING game_id
      `,
        [radiantWin, rankedGame, gameDuration, healthDrops, cheatsEnabled]
      );

      const gameID = gameRows[0].game_id;

      for (let bannedHero of bannedHeroes) {
        await query(
          `
          INSERT INTO game_bans (game_id, hero)
          VALUES ($1, $2)
          `,
          [gameID, bannedHero]
        );
      }

      for (const [team, teamData] of Object.entries(teamInfo)) {
        const isTeamRadiant = team == "DOTA_TEAM_GOODGUYS";

        const {
          kills,
          deaths,
          assists,
          guardianKills,
          buildingKills,
        } = teamData;

        await query(
          `
          INSERT INTO teams (game_id, is_radiant, kills, deaths, assists, guardian_kills, building_kills)
          VALUES ($1, $2, $3, $4, $5, $6, $7)
          `,
          [
            gameID,
            isTeamRadiant,
            kills,
            deaths,
            assists,
            JSON.stringify(guardianKills),
            JSON.stringify(buildingKills),
          ]
        );
      }

      let mmrData = {
        radiant: [],
        dire: [],
        playerMMR: {},
      };

      for (let playerData of Object.values(playerInfo)) {
        const {
          steamid,
          username,
          team,
          banChoice, // can be null
          availablePicks,
          rerolledHeroes, // can be null
          finalPick,
          kills,
          deaths,
          assists,
          lastHits,
          denies,
          doubleKills,
          rampages,
          heroDamage,
          buildingDamage,
          heroHealing,
          tpScrollsUsed,
          runesUsed,
          healthDropDuration,
          currentGold,
          totalGold,
          totalExp,
          level,
          abilities,
          itemPurchases,
          finalInventory,
          permanentBuffs,
          disconnectEvents,
          abandoned,
        } = playerData;

        const isRadiant = team == "DOTA_TEAM_GOODGUYS";
        const item0 = finalInventory["0"];
        const item1 = finalInventory["1"];
        const item2 = finalInventory["2"];
        const item3 = finalInventory["3"];
        const item4 = finalInventory["4"];
        const item5 = finalInventory["5"];
        const backpack0 = finalInventory["6"];
        const backpack1 = finalInventory["7"];
        const backpack2 = finalInventory["8"];
        const backpack3 = finalInventory["9"];

        // bots can have a null steamid
        if (!steamid) continue;

        const { rows: playerRows } = await query(
          `INSERT INTO players(steam_id, username)
           values ($1, $2)
           on conflict(steam_id)
           do UPDATE SET username = $2
           RETURNING (mmr)`,
          [steamid, username]
        );

        // TODO: Get battle pass name, and exp earned,
        // update the total exp of the battle pass, create
        // a battle pass if it doesn't exist

        const mmr = parseInt(playerRows[0].mmr);

        if (isRadiant) mmrData.radiant.push(mmr);
        else mmrData.dire.push(mmr);

        mmrData.playerMMR[steamid] = mmr;

        await query(
          `
        INSERT INTO game_players(game_id, steam_id, abandoned, is_radiant,
        hero, ban, available_picks, rerolled_heroes, hero_damage,
        building_damage, hero_healing, kills, deaths, assists, last_hits,
        denies, gold, rampages, double_kills, tp_used, runes_used,
        health_drop_duration, total_gold, total_exp, hero_level, abilities,
        permanent_buffs, disconnects, item_purchases,
        item_0, item_1, item_2, item_3, item_4, item_5,
        backpack_0, backpack_1, backpack_2, backpack_3)

        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15,
          $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29,
          $30, $31, $32, $33, $34, $35, $36, $37, $38, $39)
        `,
          [
            gameID,
            steamid,
            abandoned,
            isRadiant,
            finalPick,
            banChoice,
            JSON.stringify(availablePicks),
            JSON.stringify(rerolledHeroes),
            heroDamage,
            buildingDamage,
            heroHealing,
            kills,
            deaths,
            assists,
            lastHits,
            denies,
            currentGold,
            rampages,
            doubleKills,
            tpScrollsUsed,
            runesUsed,
            healthDropDuration,
            totalGold,
            totalExp,
            level,
            JSON.stringify(abilities),
            JSON.stringify(permanentBuffs),
            JSON.stringify(disconnectEvents),
            JSON.stringify(itemPurchases),
            item0,
            item1,
            item2,
            item3,
            item4,
            item5,
            backpack0,
            backpack1,
            backpack2,
            backpack3,
          ]
        );
      }

      const radiantMMR =
        mmrData.radiant.reduce((a, b) => a + b) / mmrData.radiant.length;
      const direMMR =
        mmrData.dire.reduce((a, b) => a + b) / mmrData.dire.length;

      let ratingChange;
      if (radiantWin) ratingChange = GetEloRatingChange(radiantMMR, direMMR);
      else ratingChange = GetEloRatingChange(direMMR, radiantMMR);

      if (ratingChange && rankedGame) {
        for (let playerData of Object.values(playerInfo)) {
          const { steamid, team } = playerData;
          const mmr = mmrData.playerMMR[steamid];
          const mmrChange = team == winnerTeam ? ratingChange : -ratingChange;

          if (mmr) {
            await query(
              `UPDATE players
              SET mmr = mmr + $1
              WHERE steam_id = $2`,
              [mmrChange, steamid]
            );
          }
        }
      }

      return gameID;
    } catch (error) {
      throw error;
    }
  },

  async getGames(limit = 100, offset = 0, hours) {
    try {
      let whereClause = "";
      if (hours) {
        whereClause = "WHERE created_at >= NOW() - $3 * INTERVAL '1 HOURS'";
      }
      const sql_query = `
      SELECT g.*, string_agg(gb.hero, ', ') as bans
        FROM games g 
        JOIN game_bans gb
        USING (game_id)
        ${whereClause}
        GROUP BY game_id
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2;
      `;
      if (hours) {
        const { rows } = await query(sql_query, [limit, offset, hours]);
        return rows;
      } else {
        const { rows } = await query(sql_query, [limit, offset]);
        return rows;
      }
    } catch (error) {
      throw error;
    }
  },

  async getGameByID(gameID) {
    try {
      const sql_query = `
      SELECT g.*, string_agg(gb.hero, ', ') as bans
        FROM games g 
        JOIN game_bans gb
        USING (game_id)
        WHERE game_id = $1
        GROUP BY game_id
      `;
      const { rows } = await query(sql_query, [gameID]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getTeamsByGameID(gameID) {
    try {
      const sql_query = `
      SELECT t.*
        FROM teams t 
        WHERE game_id = $1
      `;
      const { rows } = await query(sql_query, [gameID]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getPlayersByGameID(gameID) {
    try {
      const sql_query = `
      SELECT gp.*, p.username
        FROM game_players gp
        JOIN players p
        USING (steam_id)
        WHERE game_id = $1
      `;
      const { rows } = await query(sql_query, [gameID]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  /////////////////////////////////
  // Game Stats
  /////////////////////////////////

  async getHeroStats() {
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
        GROUP BY gp.hero
      `;
      const { rows } = await query(sql_query);
      return rows;
    } catch (error) {
      throw error;
    }
  },
};
