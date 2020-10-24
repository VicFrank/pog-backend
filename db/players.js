const { query, getClient } = require("./index");
const quests = require("./quests");
const cosmetics = require("./cosmetics");
const logs = require("./logs");

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
      select * from players where steam_id = $1
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows.length > 0;
    } catch (error) {
      throw error;
    }
  },

  async createNewPlayer(steamID, username) {
    try {
      // Insert the player,
      // Battle Pass is automatically created by the DB
      const { rows } = await query(
        `INSERT INTO players(steam_id, username)
         values ($1, $2)
         on conflict(steam_id)
         do UPDATE SET username = $2
         RETURNING *`,
        [steamID, username]
      );
      // Create three random daily quests
      await this.createInitialDailyQuests(steamID, 3);
      await this.createInitialWeeklyQuests(steamID, 3);
      await this.initializeAchievements(steamID);

      // Give the player the default announcer pack
      await this.giveCosmetic(steamID, "announcer1");

      return rows;
    } catch (error) {
      throw error;
    }
  },

  async upsertPlayer(steamID, username) {
    try {
      const { rows } = await query(
        `INSERT INTO players(steam_id, username)
         values ($1, $2)
         on conflict(steam_id)
         do UPDATE SET username = $2
         RETURNING *`,
        [steamID, username]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async isAdmin(steamID) {
    try {
      const { rows } = await query(
        `SELECT is_admin
         FROM players
         WHERE steam_id = $1`,
        [steamID]
      );
      return rows[0].is_admin;
    } catch (error) {
      throw error;
    }
  },

  async setAdmin(steamID, isAdmin, patreonLevel) {
    try {
      const { rows } = await query(
        `UPDATE players
         SET (is_admin, patreon_level) = ($2, $3)
         WHERE steam_id = $1
         RETURNING *`,
        [steamID, isAdmin, patreonLevel]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getBasicPlayer(steamID) {
    try {
      let { rows } = await query("SELECT * FROM players WHERE steam_id = $1", [
        steamID,
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getPlayerStats(steamID) {
    try {
      const sql_query = `
        SELECT p.*,
        count(*) as games,
        EXTRACT(epoch FROM (interval '24 hours' - (now()-now()::date))) as seconds_to_reset,
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
        
        COUNT(case when gp.abandoned then 1 end) as abandoned
        
        FROM players as p
        JOIN game_players as gp
        USING (steam_id)
        JOIN games as g
        USING (game_id)
        WHERE steam_id = $1 AND
          ranked = True
        GROUP BY p.steam_id
        `;
      let { rows } = await query(sql_query, [steamID]);

      let playerStats = rows[0];
      if (!playerStats) {
        let { rows } = await query(
          `SELECT * FROM players WHERE steam_id = $1`,
          [steamID]
        );
        playerStats = {
          ...rows[0],
          games: 0,
          wins: 0,
          losses: 0,
          time_played: 0,
          kills: 0,
          deaths: 0,
          assists: 0,
          double_kills: 0,
          rampages: 0,
          last_hits: 0,
          denies: 0,
          tp_used: 0,
          runes_used: 0,
          total_gold: 0,
          total_exp: 0,
          abandoned: 0,
        };

        buildings_destroyed = 0;
        guardian_kills = 0;
      }

      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getPlayer(steamID) {
    try {
      const sql_query = `
      SELECT p.*,
        EXTRACT(epoch FROM (interval '24 hours' - (now()-now()::date))) as seconds_to_reset
      FROM players as p
      WHERE steam_id = $1
      GROUP BY p.steam_id;
      `;
      let { rows } = await query(sql_query, [steamID]);
      const equippedCompanion = await this.getEquippedCompanion(steamID);
      // const teamKillStats = await this.getTeamKillStats(steamID);
      const dailyQuests = await this.getDailyQuests(steamID);
      const weeklyQuests = await this.getWeeklyQuests(steamID);
      const achievements = await quests.getAchievementsForPlayer(steamID);
      const battlePass = await this.getPlayerBattlePass(steamID);
      const battlePassLevel = await cosmetics.getBattlePassLevel(
        battlePass.bp_level
      );
      const dailyXP = await this.getDailyXP(steamID);

      // let buildings_destroyed = teamKillStats.buildingKills.buildings_destroyed;
      // let guardian_kills = teamKillStats.guardianKills.guardian_kills;

      const achievementsToClaim = achievements.filter((achievement) => {
        return achievement.quest_completed && !achievement.claimed;
      }).length;
      const dailyQuestsToClaim = dailyQuests.filter(
        (quest) => quest.quest_completed && !quest.claimed
      ).length;

      let playerStats = rows[0];
      if (!playerStats) {
        let { rows } = await query(
          `SELECT * FROM players WHERE steam_id = $1`,
          [steamID]
        );
        playerStats = {
          ...rows[0],
        };
      }

      return {
        ...playerStats,
        companion: equippedCompanion,
        dailyQuests: dailyQuests,
        weeklyQuests: weeklyQuests,
        battlePass: { ...battlePass, ...battlePassLevel },
        achievementsToClaim,
        dailyQuestsToClaim,
        dailyXP,
      };
    } catch (error) {
      throw error;
    }
  },

  async getPoggers(steamID) {
    try {
      const { rows } = await query(
        `
        SELECT poggers FROM players WHERE steam_id = $1
      `,
        [steamID]
      );
      if (rows[0]) {
        return rows[0].poggers;
      }
      return 0;
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

  async getBasicGamesToday(steamID) {
    try {
      const sql_query = `
      SELECT *, radiant_win = is_radiant as won
      FROM games
      JOIN game_players gp
      USING (game_id)
      JOIN players
      USING (steam_id)
      WHERE steam_id = $1
        AND created_at >= NOW()::date
      ORDER BY created_at DESC
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getDailyXP(steamID) {
    try {
      const sql_query = `
      SELECT sum(xp_earned) as daily_xp
      FROM games
      JOIN game_players gp
      USING (game_id)
      JOIN players
      USING (steam_id)
      WHERE steam_id = $1
        AND created_at >= NOW()::date`;
      const { rows } = await query(sql_query, [steamID]);
      return rows[0].daily_xp || 0;
    } catch (error) {
      throw error;
    }
  },

  async getBasicGames(steamID, limit = 100, offset = 0, hours) {
    let whereClause = "";
    if (hours) {
      whereClause = "AND created_at >= NOW() - $4 * INTERVAL '1 HOURS'";
    }
    try {
      const sql_query = `
      SELECT *, radiant_win = is_radiant as won
      FROM games
      JOIN game_players gp
      USING (game_id)
      JOIN players
      USING (steam_id)
      WHERE steam_id = $1
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3;
      `;
      if (hours) {
        const { rows } = await query(sql_query, [
          steamID,
          limit,
          offset,
          hours,
        ]);
        return rows;
      } else {
        const { rows } = await query(sql_query, [steamID, limit, offset]);
        return rows;
      }
    } catch (error) {
      throw error;
    }
  },

  async getGames(steamID, limit = 100, offset = 0, hours) {
    let whereClause = "";
    if (hours) {
      whereClause = "AND created_at >= NOW() - $4 * INTERVAL '1 HOURS'";
    }
    try {
      const sql_query = `
      SELECT g.*, gp.*, g.radiant_win = gp.is_radiant as won
      FROM game_players gp
      JOIN games g
      USING (game_id)
      JOIN players p
      USING (steam_id)
      WHERE p.steam_id = $1
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3;
      `;
      if (hours) {
        const { rows } = await query(sql_query, [
          steamID,
          limit,
          offset,
          hours,
        ]);
        return rows;
      } else {
        const { rows } = await query(sql_query, [steamID, limit, offset]);
        return rows;
      }
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
      ORDER BY games DESC;
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getRecords(steamID) {
    try {
      const sql_query = `
      SELECT
      max(duration) as longest_game,
      (array_agg(game_id ORDER BY duration DESC))[1] as duration_id,
      max(kills) as most_kills,
      (array_agg(game_id ORDER BY kills DESC))[1] as kills_game_id,
      max(last_hits) as most_lh,
      (array_agg(game_id ORDER BY last_hits DESC))[1] as lh_game_id,
      max(hero_damage) as most_hero_damage,
      (array_agg(game_id ORDER BY hero_damage DESC))[1] as damage_game_id,
      max(mmr_change) as biggest_upset,
      (array_agg(game_id ORDER BY mmr_change DESC))[1] as upset_game_id

      FROM game_players gp
      JOIN games g
      USING (game_id)
      JOIN players p
      USING (steam_id)
      WHERE p.steam_id = $1
      `;
      const { rows } = await query(sql_query, [steamID]);

      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async createBattlePass(steamID, bpName) {
    try {
      const { rows } = await query(
        `
      INSERT INTO player_battle_pass (steam_id, bp_name)
      VALUES ($1, $2)
      RETURNING *
      `,
        [steamID, bpName]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Gives Battle Pass Experience, and handles giving awards
   * based on levels gained. This is the only way you should
   * ever add battle pass exp to a player, to ensure they get
   * their rewards.
   * @param {*} steamID
   * @param {*} xp
   */
  async addBattlePassExp(steamID, xp) {
    try {
      const { rows } = await query(
        `
        UPDATE player_battle_pass
        SET total_experience = total_experience + $2
        WHERE steam_id = $1
        RETURNING *
      `,
        [steamID, xp]
      );

      // Give rewards for every level of the battle pass that we passed
      const { bp_level, total_experience: totalXP } = rows[0];
      const battlePass = await cosmetics.getBattlePass();

      // Get the level we were at, and the level we are at now
      const previousLevel = bp_level;
      const currentLevel = cosmetics.calculateBattlePassLevel(
        battlePass,
        totalXP
      );

      // We haven't gained any levels, we're done here
      if (previousLevel === currentLevel) {
        return;
      }

      // Update the level in the database
      const { rows: updatedBP } = await query(
        `
        UPDATE player_battle_pass
        SET bp_level = $2
        WHERE steam_id = $1
        RETURNING *
      `,
        [steamID, currentLevel]
      );

      const rewardLevels = await cosmetics.getBattlePassRewardsFromRange(
        previousLevel + 1,
        currentLevel
      );

      for (const reward of rewardLevels) {
        const { cosmetic_id, chest, chest_amount } = reward;
        if (cosmetic_id) {
          await this.giveCosmetic(steamID, cosmetic_id);
        }
        if (chest_amount && chest_amount > 0) {
          const chestID = `chest${chest}`;
          for (let i = 0; i < chest_amount; i++) {
            await this.giveCosmetic(steamID, chestID);
          }
        }
      }

      return updatedBP;
    } catch (error) {
      throw error;
    }
  },

  async getBattlePassSubscriptions(steamID) {
    try {
      const tier = await this.getBattlePassTier(steamID);
      const sql_query = `
      SELECT
      (CASE
        WHEN $2 = 1 THEN EXTRACT(epoch FROM tier1_expiration - NOW())
        WHEN $2 = 2 THEN EXTRACT(epoch FROM tier1_expiration - tier2_expiration)
        WHEN $2 = 3 THEN EXTRACT(epoch FROM tier1_expiration - tier2_expiration)
        ELSE 0
      END) as tier1_duration,
      (CASE
        WHEN $2 = 2 THEN EXTRACT(epoch FROM tier2_expiration - NOW())
        WHEN $2 = 3 THEN EXTRACT(epoch FROM tier2_expiration - tier3_expiration)
        ELSE 0
      END) as tier2_duration,
      (CASE
        WHEN $2 = 3 THEN EXTRACT(epoch FROM tier3_expiration - NOW())
        ELSE 0
      END) as tier3_duration
      FROM player_battle_pass
      WHERE steam_id = $1
      `;
      const { rows } = await query(sql_query, [steamID, tier]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getPlayerBattlePass(steamID) {
    try {
      const sql_query = `
      SELECT steam_id, bp_version, bp_level, total_experience,
      (CASE
        WHEN tier3_expiration > NOW() then 3
        WHEN tier2_expiration > NOW() then 2
        WHEN tier1_expiration > NOW() then 1
        ELSE 0
      END) as tier,
      (CASE
        WHEN tier3_expiration > NOW() then tier3_expiration
        WHEN tier2_expiration > NOW() then tier2_expiration
        WHEN tier1_expiration > NOW() then tier1_expiration
        ELSE NOW()
      END) as upgrade_expiration
      FROM player_battle_pass
      WHERE steam_id = $1
      LIMIT 1
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getBattlePassTier(steamID) {
    try {
      const battlePass = await this.getPlayerBattlePass(steamID);
      if (!battlePass) return 0;
      return battlePass.tier || 0;
    } catch (error) {
      throw error;
    }
  },

  // this assumes the player only has one battle pass
  async addBattlePassTier(steamID, tier, days) {
    try {
      if (days < 0)
        throw new error("Days cannot be negative in addBattlePassTier");
      if (!(tier === 1 || tier === 2 || tier === 3))
        throw new error(`Bad input ${tier} as tier to addBattlePassTier`);
      // Extend the duration of lower tiers by the same amount
      // so that when this tier expires, it continues seemlessly
      // to the lower tier. If the lower tier is expired,
      // it will still be expired when this tier expires.

      // example:
      // tier 1 expires in 1 month
      // we buy a tier 2 for 1 month
      // tier 1 now expires in 2 months, tier 2 expires in 1 month
      // after 1 month, we now have only tier 1, that expires in 1 month

      // If the current tier is not active, it needs to be set to now
      // before we do the rest. We can safely set all tiers that have
      // expired to NOW, as they will immediately expire.
      const currentBattlePass = await this.getPlayerBattlePass(steamID);

      if (currentBattlePass.tier < tier) {
        await query(
          `
          UPDATE player_battle_pass
          SET (tier1_expiration, tier2_expiration, tier3_expiration) = 
          (
            (CASE WHEN tier1_expiration < NOW() THEN NOW() ELSE tier1_expiration END),
            (CASE WHEN tier2_expiration < NOW() THEN NOW() ELSE tier2_expiration END),
            (CASE WHEN tier3_expiration < NOW() THEN NOW() ELSE tier3_expiration END)
          )
          WHERE steam_id = $1
        `,
          [steamID]
        );
      }

      let sql_query = "";
      if (tier === 3) {
        sql_query = `
          UPDATE player_battle_pass
          SET (tier1_expiration, tier2_expiration, tier3_expiration) = 
          (
            tier1_expiration + $2 * INTERVAL '1 DAY',
            tier2_expiration + $2 * INTERVAL '1 DAY',
            tier3_expiration + $2 * INTERVAL '1 DAY'
          )
          WHERE steam_id = $1
        `;
      } else if (tier === 2) {
        sql_query = `
          UPDATE player_battle_pass
          SET (tier1_expiration, tier2_expiration) = 
          (
            tier1_expiration + $2 * INTERVAL '1 DAY',
            tier2_expiration + $2 * INTERVAL '1 DAY'
          )
          WHERE steam_id = $1
        `;
      } else if (tier === 1) {
        sql_query = `
          UPDATE player_battle_pass
          SET tier1_expiration = 
            tier1_expiration + $2 * INTERVAL '1 DAY'
          WHERE steam_id = $1
        `;
      }
      await query(sql_query, [steamID, days]);

      // if tier 3, also give the player the tier 3 cosmetics
      // FLYING HONEY HEIST BABY ROSHLING, HONEY HEIST BABY ROSHLING FX
      // also, they lose these items when their tier 3 subscription expires
      if (tier === 3) {
        await this.giveUniqueCosmetic(steamID, "honey_roshan");
        await this.giveUniqueCosmetic(steamID, "honey_heist");
        await this.giveUniqueCosmetic(steamID, "golden_skin");
      }

      // initialize their weekly quests if they haven't yet
      await this.createInitialWeeklyQuests(steamID, 3);
    } catch (error) {
      throw error;
    }
  },

  async givePostGameBP(steamID, winner, bonusMultiplier = 1) {
    /*
      BASELINE:
      50 XP per win (capped at 20 wins)
      200 XP bonus for the first win of the day (250 total)

      SILVER TICKET:
      100 XP per win (capped at 20 wins)
      300 XP bonus for the first win of the day (400 total)

      GOLD TICKET:
      200 XP per win (capped at 20 wins)
      400 XP bonus for the first win of the day (600 total)

      DIAMOND TICKET:
      200 XP per win (capped at 20 wins)
      400 XP bonus for the first win of the day (600 total)

      If you have an ally with a diamond ticket, give +25% XP
    */
    try {
      const games = await this.getBasicGamesToday(steamID);

      let numRecentGames = 0;
      let hasWonToday = false;
      for (let game of games) {
        if (game.won) {
          hasWonToday = true;
          numRecentGames += 1;
        } else {
          numRecentGames += 0.5;
        }
      }

      const { tier } = await this.getPlayerBattlePass(steamID);
      let reward = 0;

      if (numRecentGames > 20) {
        return;
      } else if (!hasWonToday && winner) {
        reward = 250;
        if (tier === 1) {
          reward = 400;
        } else if (tier === 2 || tier === 3) {
          reward = 600;
        }
      } else {
        reward = 50;
        if (tier === 1) {
          reward = 100;
        } else if (tier === 2 || tier === 3) {
          reward = 200;
        }
      }

      if (!winner) {
        reward = reward * 0.5;
      }

      reward = Math.floor(reward * bonusMultiplier);

      await logs.addTransactionLog(steamID, "game_xp", {
        winner,
        reward,
      });

      await this.addBattlePassExp(steamID, reward);

      return reward;
    } catch (error) {
      throw error;
    }
  },

  async addPlayerLog(steamID, event) {
    try {
      const sql_query = `
      INSERT INTO player_logs (steam_id, log_event)
      VALUES ($1, $2)
      `;
      await query(sql_query, [steamID, event]);
      return;
    } catch (error) {
      throw error;
    }
  },

  async getRecentRerolls(steamID) {
    try {
      const sql_query = `
      SELECT log_event, log_time FROM player_logs
      WHERE steam_id = $1 AND log_event = 'hero-reroll'
      LIMIT 10
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getBaseNumTips(steamID) {
    try {
      const tier = await this.getBattlePassTier(steamID);
      switch (tier) {
        case 0:
          return 0;
        case 1:
          return 15;
        case 2:
          return 15;
        case 3:
          return 15;
      }
    } catch (error) {
      throw error;
    }
  },

  async getNumDailyTips(steamID) {
    try {
      const battlePass = await this.getPlayerBattlePass(steamID);
      if (!battlePass || battlePass.tier == 0) {
        return 0;
      } else {
        const sql_query = `
        SELECT count(*) FROM player_logs
        WHERE steam_id = $1 AND log_event = 'tip' AND log_time >= NOW()::date
        `;
        const { rows } = await query(sql_query, [steamID]);
        const baseNumTips = await this.getBaseNumTips(steamID);

        return baseNumTips - rows[0].count;
      }
    } catch (error) {
      throw error;
    }
  },

  async tipPlayer(steamID, tippedSteamID) {
    try {
      // log a tip event
      await this.addPlayerLog(steamID, "tip");

      // get the player's tier
      const tier = await this.getBattlePassTier(steamID);

      let tipAmount = 0;
      switch (tier) {
        case 0:
          tipAmount = 0;
        case 1:
          tipAmount = 1;
        case 2:
          tipAmount = 5;
        case 3:
          tipAmount = 10;
      }

      await this.modifyPoggers(tippedSteamID, tipAmount);
    } catch (error) {
      throw error;
    }
  },

  async getPlayerCosmetics(steamID, onlyEquipped = false) {
    try {
      const tier = await this.getBattlePassTier(steamID);
      const filter = onlyEquipped ? "AND equipped = TRUE" : "";
      const sql_query = `
      SELECT *
      FROM player_cosmetics
      JOIN cosmetics
      USING (cosmetic_id)
      WHERE steam_id = $1 AND $2 >= min_bp_tier
      ${filter}
      `;
      const { rows } = await query(sql_query, [steamID, tier]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async equipCosmetics(steamID, cosmeticID, equipped) {
    try {
      if (equipped) {
        // unequip all other items in this equip group
        let { rows } = await query(
          `
          SELECT equip_group
          FROM cosmetics
          WHERE cosmetic_id = $1
        `,
          [cosmeticID]
        );

        const equipGroup = rows[0].equip_group;

        await query(
          `UPDATE player_cosmetics pc
          SET equipped = FALSE
          FROM cosmetics c
          WHERE pc.steam_id = $1
            AND c.equip_group = $2
            AND c.cosmetic_id = pc.cosmetic_id
          `,
          [steamID, equipGroup]
        );
      }

      const sql_query = `
      UPDATE player_cosmetics
      SET equipped = ${equipped}
      WHERE steam_id = $1 AND cosmetic_id = $2
      RETURNING *
      `;
      let { rows } = await query(sql_query, [steamID, cosmeticID]);

      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getCompanions(steamID, onlyEquipped = false) {
    try {
      const tier = await this.getBattlePassTier(steamID);
      const filter = onlyEquipped ? "AND equipped = TRUE" : "";
      const sql_query = `
      SELECT *
      FROM player_companions
      JOIN cosmetics
      USING (cosmetic_id)
      WHERE steam_id = $1 AND $2 >= min_bp_tier
      ${filter}
      `;
      const { rows } = await query(sql_query, [steamID, tier]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getEquippedCompanion(steamID) {
    try {
      const tier = await this.getBattlePassTier(steamID);
      const sql_query = `
      SELECT *
      FROM player_companions
      JOIN cosmetics
      USING (cosmetic_id)
      WHERE steam_id = $1 AND equipped = TRUE  AND $2 >= min_bp_tier
      `;
      const { rows } = await query(sql_query, [steamID, tier]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getAllCosmetics(steamID, onlyEquipped = false) {
    try {
      const cosmetics = await this.getPlayerCosmetics(steamID, onlyEquipped);
      const companions = await this.getCompanions(steamID, onlyEquipped);
      return [...cosmetics, ...companions];
    } catch (error) {
      throw error;
    }
  },

  async hasCosmetic(steamID, cosmeticID) {
    try {
      const allCosmetics = await this.getAllCosmetics(steamID);
      return allCosmetics.some(
        (cosmetic) => cosmetic.cosmetic_id === cosmeticID
      );
    } catch (error) {
      throw error;
    }
  },

  async setCompanion(steamID, companion_id) {
    try {
      // unequip current companion, and equip this one
      const query1 = `
        UPDATE player_companions
        SET equipped = FALSE
        WHERE steam_id = $1;
      `;
      await query(query1, [steamID]);

      const query2 = `
        UPDATE player_companions
        SET equipped = TRUE
        WHERE companion_id = $1
        RETURNING *;
      `;
      const { rows } = await query(query2, [companion_id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async modifyPoggers(steamID, amount) {
    try {
      const queryText = `
        UPDATE players
        SET poggers = poggers + $1
        WHERE steam_id = $2
        RETURNING *
      `;
      const { rows } = await query(queryText, [amount, steamID]);
    } catch (error) {
      throw error;
    }
  },

  async itemTransaction(steamID, transactionData) {
    try {
      if (!transactionData) {
        throw new Error("No transaction supplied");
      }

      // Log the transaction
      await logs.addTransactionLog(steamID, "transaction", transactionData);

      // Add and remove companions
      if (transactionData.companions) {
        const { companions } = transactionData;
        for (const companionData of companions) {
          let { cosmetic_id, effect, level, amount } = companionData;

          if (amount > 0) {
            for (let i = 0; i < amount; i++) {
              queryText = `
              INSERT INTO player_companions as pc
                (steam_id, cosmetic_id, companion_level, effect)
              VALUES
                ($1, $2, $3, $4)
              `;
              await query(queryText, [steamID, cosmetic_id, level, effect]);
            }
          } else if (amount < 0) {
            for (let i = 0; i < amount * -1; i++) {
              const queryText = `
              WITH deleted AS
              (DELETE FROM player_companions
                WHERE companion_id = 
                any (array(
                  SELECT companion_id
                  FROM player_companions
                  WHERE steam_id = $1 AND 
                    companion_level = $2 AND
                    effect = $3 LIMIT 1))
              RETURNING *)
              SELECT count(*) FROM deleted;
            `;
              const { rows } = await query(queryText, [steamID, level, effect]);
              const rowsDeleted = rows[0].count;
              if (rowsDeleted === 0) {
                throw new Error("Tried to remove nonexistent companion");
              }
            }
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

      // Update battle pass
      if (transactionData.battlePass) {
        const { battlePass } = transactionData;
        const { upgradeTier, upgradeDays, bonusExp } = battlePass;

        const xpToAdd = bonusExp || 0;

        if (xpToAdd != 0) {
          await this.addBattlePassExp(steamID, xpToAdd);
        }

        if (upgradeTier != undefined && upgradeDays) {
          await this.addBattlePassTier(steamID, upgradeTier, upgradeDays);
        }
      }

      // Add or remove misc/cosmetic items
      if (transactionData.items) {
        const { items } = transactionData;
        const entries = Object.entries(items);

        for (const [cosmeticID, amount] of entries) {
          if (amount > 0) {
            for (let i = 0; i < amount; i++) {
              queryText = `
              INSERT INTO player_cosmetics
              (steam_id, cosmetic_id) VALUES
              ($1, $2)
              `;
              await query(queryText, [steamID, cosmeticID]);
            }
          } else if (amount < 0) {
            for (let i = 0; i < amount * -1; i++) {
              const queryText = `
              WITH deleted AS
                (DELETE FROM player_cosmetics
                WHERE ctid IN (
                  SELECT ctid
                  FROM player_cosmetics
                  WHERE steam_id = $1 AND cosmetic_id = $2
                  LIMIT 1)
                RETURNING *)
                SELECT count(*) FROM deleted;
              `;
              const { rows } = await query(queryText, [steamID, cosmeticID]);
              const rowsDeleted = rows[0].count;
              if (rowsDeleted == 0) {
                throw new Error("Tried to remove non-existent cosmetic");
              }
            }
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
    } catch (error) {
      throw error;
    }
  },

  async giveCosmetic(steamID, cosmeticID) {
    try {
      const cosmetic = await cosmetics.getCosmetic(cosmeticID);
      if (cosmetic.cosmetic_type === "Companion") {
        let queryText = `
        INSERT INTO player_companions (steam_id, cosmetic_id)
        VALUES ($1, $2)
        `;
        await query(queryText, [steamID, cosmeticID]);
      } else {
        let queryText = `
        INSERT INTO player_cosmetics (steam_id, cosmetic_id)
        VALUES ($1, $2)
        `;
        await query(queryText, [steamID, cosmeticID]);
      }
    } catch (error) {
      throw error;
    }
  },

  async giveUniqueCosmetic(steamID, cosmeticID) {
    try {
      const hasCosmetic = await this.hasCosmetic(steamID, cosmeticID);
      if (hasCosmetic) return false;
      await this.giveCosmetic(steamID, cosmeticID);
    } catch (error) {
      throw error;
    }
  },

  async removeCosmetic(steamID, cosmeticID) {
    try {
      const queryText = `
        WITH deleted AS
          (DELETE FROM player_cosmetics
          WHERE ctid IN (
            SELECT ctid
            FROM player_cosmetics
            WHERE steam_id = $1 AND cosmetic_id = $2
            LIMIT 1)
          RETURNING *)
          SELECT count(*) FROM deleted;
        `;
      const { rows } = await query(queryText, [steamID, cosmeticID]);
      const rowsDeleted = rows[0].count;
      if (rowsDeleted == 0) {
        throw new Error("Tried to remove non-existent cosmetic");
      }
    } catch (error) {
      throw error;
    }
  },

  async consumeItem(steamID, cosmeticID) {
    try {
      const cosmetic = await cosmetics.getCosmetic(cosmeticID);

      if (!cosmetic) {
        throw new Error("Invalid cosmeticID");
      }

      const consumable =
        cosmetic.cosmetic_type === "XP" ||
        cosmetic.cosmetic_type === "Chest XP";
      if (!consumable) {
        throw new Error("This item is not consumable");
      }

      const hasCosmetic = await this.hasCosmetic(steamID, cosmeticID);
      if (!hasCosmetic) {
        throw new Error("You don't own this item");
      }

      let experience = 0;
      switch (cosmeticID) {
        case "xp_coupon_500":
          experience = 500;
          break;
        case "xp_coupon_1000":
          experience = 1000;
          break;
        case "xp_coupon_2000":
          experience = 2000;
          break;
        case "xp_coupon_5000":
          experience = 5000;
          break;
        case "xp_coupon_10000":
          experience = 10000;
          break;
        case "xp_coupon_25000":
          experience = 25000;
          break;
        case "xp_1":
          experience = 10000;
          break;
        case "xp_2":
          experience = 25000;
          break;
        case "xp_3":
          experience = 60000;
          break;
        case "xp_4":
          experience = 175000;
          break;
        case "xp_5":
          experience = 400000;
          break;
      }

      // Log the transaction
      await logs.addTransactionLog(steamID, "consume_item", {
        steamID,
        cosmeticID,
      });

      // remove the item
      await this.removeCosmetic(steamID, cosmeticID);
      await this.addBattlePassExp(steamID, experience);

      return experience;
    } catch (error) {
      throw error;
    }
  },

  async useBPAccelerator(steamID, cosmeticID) {
    try {
      let upgradeTier = 0;
      switch (cosmeticID) {
        case "bpaccel1":
          upgradeTier = 1;
          break;
        case "bpaccel2":
          upgradeTier = 2;
          break;
        case "bpaccel3":
          upgradeTier = 3;
          break;
      }

      if (upgradeTier === 0) {
        throw new Error("This isn't a BP Accelerator");
      }

      const hasCosmetic = await this.hasCosmetic(steamID, cosmeticID);
      if (!hasCosmetic) {
        throw new Error("You don't own this item");
      }

      // Log the transaction
      await logs.addTransactionLog(steamID, "bpaccel", {
        steamID,
        cosmeticID,
      });

      await this.addBattlePassTier(steamID, upgradeTier, 31);
      await this.removeCosmetic(steamID, cosmeticID);
    } catch (error) {
      throw error;
    }
  },

  async buyCosmetic(steamID, cosmeticID, client) {
    try {
      const cosmetic = await cosmetics.getCosmetic(cosmeticID);

      if (!cosmetic) {
        throw new Error("Invalid cosmeticID");
      }
      // Make sure the player has enough poggers
      const poggers = await this.getPoggers(steamID);
      const price = cosmetic.cost;

      if (poggers < price) {
        throw new Error("Not enough poggers!");
      }
      if (price < 1) {
        throw new Error("Item is not purchaseable with poggers");
      }

      // Don't allow purchasing duplicate cosmetics (with some exceptions)
      const cosmeticType = cosmetic.cosmetic_type;
      const canBuyMultiple =
        cosmeticType == "BP Accelerator" ||
        cosmeticType == "Chest" ||
        cosmeticType == "XP";

      if (!canBuyMultiple) {
        const hasCosmetic = await this.hasCosmetic(steamID, cosmeticID);
        if (hasCosmetic) {
          throw new Error("Can't buy duplicate cosmetics of this type");
        }
      }

      // log the transaction
      await logs.addTransactionLog(steamID, "poggers_purchase", {
        price,
        cosmeticID,
      });

      // Do the transaction
      await this.modifyPoggers(steamID, -price);
      await this.giveCosmetic(steamID, cosmeticID);
    } catch (error) {
      throw error;
    }
  },

  async getRandomReward(steamID, rarity, bucket = []) {
    try {
      let { rows: potentialRewards } = await query(
        `
      SELECT * FROM cosmetics
      WHERE rarity = $1
      AND cost > 0
      AND cosmetic_type != 'Chest'
      `,
        [rarity]
      );
      const existingItems = await this.getAllCosmetics(steamID);

      potentialRewards = potentialRewards.filter((cosmetic) => {
        const alreadyHasItem = existingItems.some((existingCosmetic) => {
          return cosmetic.cosmetic_id === existingCosmetic.cosmetic_id;
        });
        // the bucket tracks what we're rewarding in this chest
        const inBucket = bucket.some((existingCosmetic) => {
          return cosmetic.cosmetic_id === existingCosmetic.cosmetic_id;
        });
        const isChest = cosmetic.cosmetic_type === "Chest";

        return !alreadyHasItem && !inBucket && !isChest;
      });

      if (potentialRewards.length === 0) {
        return null;
      }

      // return a random reward
      return potentialRewards[
        Math.floor(Math.random() * potentialRewards.length)
      ];
    } catch (error) {
      throw error;
    }
  },

  async openChest(steamID, chestID) {
    try {
      const { rows: existingChests } = await query(
        `SELECT * FROM player_cosmetics
        WHERE cosmetic_id = $1 AND steam_id = $2`,
        [chestID, steamID]
      );

      if (existingChests.length === 0) {
        throw new Error("Tried to open non-existent chest");
      }

      await logs.addTransactionLog(steamID, "open_chest", {
        steamID,
        chestID,
      });

      // Increment chest opening progress
      this.addQuestProgressByStat(steamID, "chests_opened", 1);

      const { rows: itemRewards } = await query(
        `SELECT * FROM chest_item_rewards
        WHERE cosmetic_id = $1`,
        [chestID]
      );
      const { rows: poggerRewards } = await query(
        `SELECT * FROM chest_pogger_rewards
        WHERE cosmetic_id = $1
        ORDER BY cum_sum `,
        [chestID]
      );
      const { rows: bonusRewards } = await query(
        `SELECT * FROM chest_bonus_rewards
        WHERE cosmetic_id = $1
        ORDER BY cum_sum `,
        [chestID]
      );

      let chestItems = [];
      let pityPoggers = 0;
      let pityPoggersRarities = {};
      for (const itemReward of itemRewards) {
        let { reward_rarity, reward_odds } = itemReward;

        while (reward_odds > 0) {
          const rewardProbability = reward_odds;
          // generate a random number (1-100) (inclusive)
          const roll = Math.floor(Math.random() * 100) + 1;

          if (rewardProbability >= roll) {
            const randomReward = await this.getRandomReward(
              steamID,
              reward_rarity,
              chestItems
            );

            if (randomReward !== null) {
              chestItems.push(randomReward);
            } else {
              // If you already have the item, convert it to poggers
              switch (reward_rarity) {
                case "Common":
                  pityPoggers += 30;
                  pityPoggersRarities["Common"] = 30;
                  break;
                case "Uncommon":
                  pityPoggers += 60;
                  pityPoggersRarities["Uncommon"] = 60;
                  break;
                case "Rare":
                  pityPoggers += 125;
                  pityPoggersRarities["Rare"] = 125;
                  break;
                case "Mythical":
                  pityPoggers += 300;
                  pityPoggersRarities["Mythical"] = 300;
                  break;
                case "Legendary":
                  pityPoggers += 800;
                  pityPoggersRarities["Legendary"] = 800;
                  break;
              }
            }
          }
          reward_odds -= 100;
        }
      }

      let chestPoggers = 0;
      chestPoggers;

      // generate a random number (1-100) (inclusive)
      let roll = Math.floor(Math.random() * 100) + 1;

      for (const itemReward of poggerRewards) {
        const { cum_sum, poggers } = itemReward;

        if (cum_sum >= roll) {
          chestPoggers += poggers;
          break;
        }
      }

      // Choose a potential bonus reward
      roll = Math.floor(Math.random() * 100) + 1;

      for (const itemReward of bonusRewards) {
        const { cum_sum, reward_id } = itemReward;

        if (cum_sum >= roll) {
          const bonusReward = await cosmetics.getCosmetic(reward_id);
          chestItems.push(bonusReward);
          break;
        }
      }

      let items = {};
      let companions = [];

      for (const item of chestItems) {
        if (item.cosmetic_type === "Companion") {
          companions.push({
            cosmetic_id: item.cosmetic_id,
            effect: "-1",
            level: "1",
            amount: "1",
          });
        } else {
          items[item.cosmetic_id] = "1";
        }
      }

      // consume this chest as part of the transaction
      items[chestID] = "-1";

      const transaction = {
        poggers: chestPoggers + pityPoggers,
        items,
        companions,
      };

      // add the rewards to the player
      await this.itemTransaction(steamID, transaction);

      return {
        items: chestItems,
        poggers: chestPoggers,
        pityPoggers,
        pityPoggersRarities,
      };
    } catch (error) {
      throw error;
    }
  },

  // Quests

  // Returns a random sample (either with or without replacement) from an array
  randomSample(arr, k, withReplacement = false) {
    let sample;
    if (withReplacement === true) {
      // sample with replacement
      sample = Array.from(
        { length: k },
        () => arr[Math.floor(Math.random() * arr.length)]
      );
    } else {
      // sample without replacement
      if (k > arr.length) {
        throw new RangeError(
          "Sample size must be less than or equal to array length when sampling without replacement."
        );
      }
      sample = arr
        .map((a) => [a, Math.random()])
        .sort((a, b) => {
          return a[1] < b[1] ? -1 : 1;
        })
        .slice(0, k)
        .map((a) => a[0]);
    }
    return sample;
  },

  /**
   * Gets all active quests and achievements, including
   * achievements that don't have a player_quests row yet
   * @param {string} steamID
   */
  async getAllQuestsForPlayer(steamID) {
    try {
      const sql_query = `
      SELECT * FROM quests q
      JOIN player_quests USING (quest_id)
      WHERE steam_id = $1
	    ORDER BY quest_id
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Creates three random daily quests for the user.   *
   * This function should only be called when a player is
   * created for the first time.
   * @param {string} steamID
   */
  async createInitialDailyQuests(steamID, numQuests) {
    try {
      const currentQuests = await this.getDailyQuests(steamID);
      if (currentQuests.length > 0) {
        throw new Error("Player Daily Quests have already been initialized!");
      }

      // Randomly choose three daily quests
      const allQuests = await quests.getAllDailyQuests();
      const questsToInsert = this.randomSample(allQuests, numQuests);

      // Add the new quests
      let newQuests = [];
      let index = 1;
      for (quest of questsToInsert) {
        const insert_query = `
          INSERT INTO player_quests (steam_id, quest_id, quest_index) VALUES($1, $2, $3)
          RETURNING *;
        `;
        const { rows } = await query(insert_query, [
          steamID,
          quest.quest_id,
          index,
        ]);
        newQuests.push(rows[0]);

        index++;
      }

      return newQuests;
    } catch (error) {
      throw error;
    }
  },

  async createInitialWeeklyQuests(steamID, numQuests) {
    try {
      const currentQuests = await this.getWeeklyQuestsIncludeHidden(steamID);
      if (currentQuests.length > 0) {
        // initial quests have already been initialized
        return;
      }

      // Randomly choose three weekly quests
      const allQuests = await quests.getAllWeeklyQuests();
      const questsToInsert = this.randomSample(allQuests, numQuests);

      // Add the new quests
      let newQuests = [];
      let index = 1;
      for (quest of questsToInsert) {
        const insert_query = `
          INSERT INTO player_quests (steam_id, quest_id, quest_index) VALUES($1, $2, $3)
          RETURNING *;
        `;
        const { rows } = await query(insert_query, [
          steamID,
          quest.quest_id,
          index,
        ]);
        newQuests.push(rows[0]);

        index++;
      }

      return newQuests;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Initializes all achievements for the player
   * @param {string} steamID
   */
  async initializeAchievements(steamID) {
    try {
      const allAchievements = await quests.getAllAchievements();

      for (quest of allAchievements) {
        const insert_query = `
          INSERT INTO player_quests (steam_id, quest_id) VALUES($1, $2)
        `;
        await query(insert_query, [steamID, quest.quest_id]);
      }
      return;
    } catch (error) {
      throw error;
    }
  },

  async getAllRerollableQuests(steamID) {
    try {
      const sql_query = `
      SELECT pq.*, q.*
      FROM player_quests pq
      JOIN quests q
      USING (quest_id)
      JOIN players p
      USING (steam_id)
      WHERE steam_id = $1 AND q.is_achievement = FALSE
      ORDER BY quest_index DESC
      `;
      const { rows } = await query(sql_query, [steamID]);

      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Randomly choose a new quest
  async chooseNewQuest(currentQuests, allQuests) {
    const currentQuestIDs = currentQuests.map((quest) => quest.quest_id);
    const currentQuestStats = currentQuests.map((quest) => quest.stat);
    const newQuests = allQuests.filter((quest) => {
      return (
        !currentQuestIDs.includes(quest.quest_id) &&
        !currentQuestStats.includes(quest.stat)
      );
    });

    const questToAdd = newQuests[Math.floor(Math.random() * newQuests.length)];

    return questToAdd;
  },

  /**
   * Removes the given quest, and generates a new one that the player
   * does not already have, and is not the given quest
   * @param {string} steamID
   * @param {number} questID
   */
  async rerollQuest(steamID, questID) {
    try {
      const quest = await quests.getQuest(questID);

      if (!quest) throw new Error(`Quest with ID ${questID} does not exist`);

      const isWeekly = quest.is_weekly;
      const interval = isWeekly ? 24 * 7 : 23;

      // Make sure the player has the quest, and that it's at least 24 hours old
      let sql_query = `
      SELECT
      created < current_timestamp - $3 * INTERVAL '1 HOURS' as can_reroll
      FROM player_quests
      JOIN quests
      USING (quest_id)
      WHERE is_achievement = FALSE AND steam_id = $1 AND quest_id = $2
      `;
      const { rows: createdRows } = await query(sql_query, [
        steamID,
        questID,
        interval,
      ]);

      if (createdRows.length === 0)
        throw new Error(`Player does not have quest with ID ${questID}`);
      if (!createdRows[0].can_reroll)
        throw new Error(`Can't reroll this quest yet`);

      // Make sure we're rerolling a quest the player actually has
      const currentQuests = await this.getAllRerollableQuests(steamID);
      if (!currentQuests.some((quest) => (quest.quest_id = questID))) {
        throw new Error(`Can't reroll quest ${questID} you don't have`);
      }

      const allQuests = isWeekly
        ? await quests.getAllWeeklyQuests()
        : await quests.getAllDailyQuests();

      const questToAdd = await this.chooseNewQuest(currentQuests, allQuests);
      const questToAddID = questToAdd.quest_id;

      // Log the reroll
      await logs.addTransactionLog(steamID, "quest_reroll", {
        steamID,
        oldQuest: questID,
        newQuest: questToAddID,
      });

      // Update the quest
      sql_query = `
        UPDATE player_quests
        SET (quest_id, quest_progress, created, claimed) =
        ($3, DEFAULT, DEFAULT, DEFAULT)
        WHERE steam_id = $1 AND quest_id = $2
        RETURNING *
      `;
      const { rows: newQuestRows } = await query(sql_query, [
        steamID,
        questID,
        questToAddID,
      ]);

      return { ...newQuestRows[0], success: true };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Returns if the player has the quest as one of their
   * current quests. Doesn't count quests the player
   * can't use due to patreon level
   * @param {string} steamID
   * @param {number} questID
   */
  async playerHasQuest(steamID, questID) {
    const dailyQuests = await this.getDailyQuests(steamID);
    for (let quest of dailyQuests) {
      if (quest.quest_id === questID) return true;
    }
    const weeklyQuests = await this.getWeeklyQuests(steamID);
    for (let quest of weeklyQuests) {
      if (quest.quest_id === questID) return true;
    }
    return false;
  },

  /**
   * Claims the poggers/xp for a completed quest/achievement.
   * Only claims if the player has made enough progress to claim
   * and the quest has not been already claimed
   * */
  async claimQuestReward(steamID, questID) {
    try {
      let quest = await quests.getQuest(questID);

      if (!quest) throw new Error(`Quest with ID ${questID} does not exist`);

      const isWeekly = quest.is_weekly;
      const interval = isWeekly ? 24 * 7 : 23;

      // Get the quest rewards and requirements for the DB,
      // and make sure the quest is actually complete
      let sql_query = `
        SELECT pq.quest_progress, pq.claimed, q.required_amount,
          q.poggers_reward, q.xp_reward, is_achievement,
          created < current_timestamp - $3 * INTERVAL '1 HOURS' as can_reroll
        FROM player_quests pq
        JOIN quests q
        USING (quest_id)
        WHERE steam_id = $1 AND quest_id = $2
      `;
      const { rows } = await query(sql_query, [steamID, questID, interval]);

      if (rows.length === 0) {
        throw new Error(`Player does not have quest with ID ${questID}`);
      }

      quest = rows[0];

      const questProgress = quest.quest_progress;
      const required = quest.required_amount;
      const claimed = quest.claimed;
      const poggers = quest.poggers_reward;
      const xp = quest.xp_reward;
      const canReroll = quest.can_reroll && !quest.is_achievement;

      if (questProgress < required)
        throw new Error(`Quest is not completed, ${questProgress}/${required}`);
      if (claimed) throw new Error(`Quest ${questID} has already been claimed`);
      if (!this.playerHasQuest(steamID, questID))
        throw new Error("Player does not have quest");

      // Log the transaction
      await logs.addTransactionLog(steamID, "claim_quest", {
        steamID,
        questID,
        poggers,
        xp,
      });

      // Set the quest as claimed
      sql_query = `
        UPDATE player_quests
        SET claimed = TRUE
        WHERE steam_id = $1 AND quest_id = $2
        RETURNING *
      `;
      await query(sql_query, [steamID, questID]);

      // Reroll if possible
      if (canReroll) {
        await this.rerollQuest(steamID, questID);
      }

      // Add the rewarded poggers
      sql_query = `
        UPDATE players
        SET poggers = poggers + $2
        WHERE steam_id = $1
      `;
      await query(sql_query, [steamID, poggers]);

      // Add the rewarded xp to the battle pass
      await this.addBattlePassExp(steamID, xp);

      return { xp, poggers, success: true };
    } catch (error) {
      throw error;
    }
  },

  async getNumDailyQuests(steamID) {
    try {
      const tier = await this.getBattlePassTier(steamID);

      switch (tier) {
        case 0:
          return 2;
        case 1:
          return 2;
        case 2:
          return 3;
        case 3:
          return 3;

        default:
          return 2;
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * Gets the active daily quests for a player.
   * Returns 2 quests for bp tier 1,2 and 3 for higher
   * @param {String} steamID
   */
  async getDailyQuests(steamID) {
    try {
      const sql_query = `
      SELECT pq.*, q.*, p.patreon_level,
        LEAST(quest_progress, required_amount) as capped_quest_progress,
        quest_progress >= required_amount as quest_completed,
        created < current_timestamp - interval '23 hours' as can_reroll
      FROM player_quests pq
      JOIN quests q
      USING (quest_id)
      JOIN players p
      USING (steam_id)
      WHERE steam_id = $1 AND q.is_achievement = FALSE AND is_weekly = FALSE
      ORDER BY quest_index DESC
      `;
      const { rows } = await query(sql_query, [steamID]);

      const numQuests = await this.getNumDailyQuests(steamID);

      return rows.slice(0, numQuests);
    } catch (error) {
      throw error;
    }
  },

  async getDailyQuestsIncludeHidden(steamID) {
    try {
      const sql_query = `
      SELECT pq.*, q.*, p.patreon_level,
        LEAST(quest_progress, required_amount) as capped_quest_progress,
        quest_progress >= required_amount as quest_completed,
        created < current_timestamp - interval '23 hours' as can_reroll
      FROM player_quests pq
      JOIN quests q
      USING (quest_id)
      JOIN players p
      USING (steam_id)
      WHERE steam_id = $1 AND q.is_achievement = FALSE AND is_weekly = FALSE
      ORDER BY quest_index DESC
      `;
      const { rows } = await query(sql_query, [steamID]);

      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getWeeklyQuests(steamID) {
    try {
      const tier = await this.getBattlePassTier(steamID);

      if (tier < 2) return null;

      const sql_query = `
      SELECT pq.*, q.*, p.patreon_level,
        LEAST(quest_progress, required_amount) as capped_quest_progress,
        quest_progress >= required_amount as quest_completed,
        created < current_timestamp - interval '168 hours' as can_reroll
      FROM player_quests pq
      JOIN quests q
      USING (quest_id)
      JOIN players p
      USING (steam_id)
      WHERE steam_id = $1 AND q.is_achievement = FALSE AND is_weekly = TRUE
      ORDER BY quest_index DESC
      `;
      const { rows } = await query(sql_query, [steamID]);

      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getWeeklyQuestsIncludeHidden(steamID) {
    try {
      const tier = await this.getBattlePassTier(steamID);

      const sql_query = `
      SELECT pq.*, q.*, p.patreon_level,
        LEAST(quest_progress, required_amount) as capped_quest_progress,
        quest_progress >= required_amount as quest_completed,
        created < current_timestamp - interval '168 hours' as can_reroll
      FROM player_quests pq
      JOIN quests q
      USING (quest_id)
      JOIN players p
      USING (steam_id)
      WHERE steam_id = $1 AND q.is_achievement = FALSE AND is_weekly = TRUE
      ORDER BY quest_index DESC
      `;
      const { rows } = await query(sql_query, [steamID]);

      return rows;
    } catch (error) {
      throw error;
    }
  },

  async incrementQuestProgress(steamID, questID, amount) {
    try {
      let sql_query = `
      UPDATE player_quests
      SET quest_progress = quest_progress + $3
      WHERE steam_id = $1 AND quest_id = $2
      `;
      await query(sql_query, [steamID, questID, amount]);
    } catch (error) {
      throw error;
    }
  },

  async addQuestProgressByStat(steamID, stat, amount) {
    try {
      const allQuests = await quests.getAllQuestsWithStat(stat);
      for (const quest of allQuests) {
        const { quest_id } = quest;
        this.incrementQuestProgress(steamID, quest_id, amount);
      }
    } catch (error) {
      throw error;
    }
  },

  async addGameQuestProgress(playerData, teamData) {
    const {
      steamid: steamID,
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
      winner,
      neutralItems,
      healingGoblets,
      highFives,
    } = playerData;

    const { guardianKills, buildingKills } = teamData;

    const activeQuests = await this.getAllQuestsForPlayer(steamID);

    for (let quest of activeQuests) {
      const questID = quest.quest_id;
      let progress = 0;
      switch (quest.stat) {
        case "runes_picked_up":
          progress = runesUsed;
          break;
        case "neutral_item_purchased":
          progress = neutralItems;
          break;
        case "games_won":
          progress = winner ? 1 : 0;
          break;
        case "damage_dealt":
          progress = heroDamage;
          break;
        case "guardians_killed":
          progress = guardianKills ? Object.keys(guardianKills).length : 0;
          break;
        case "nokrah_purchased":
          const nokrahPurchased = itemPurchases
            ? Object.values(itemPurchases).indexOf(
                "item_recipe_nokrash_blade"
              ) > -1
            : 0;
          progress = nokrahPurchased ? 1 : 0;
          break;
        case "creeps_killed":
          progress = lastHits;
          break;
        case "gold_earned":
          progress = totalGold;
          break;
        case "assists":
          progress = assists;
          break;
        case "hero_kills":
          progress = kills;
          break;
        case "denies":
          progress = denies;
          break;
        case "rampages":
          progress = rampages;
          break;
        case "healing_goblets":
          progress = healingGoblets;
          break;
        case "total_healed":
          progress = heroHealing;
          break;
        case "guardian_buffs_received":
          // progress = ;
          break;
        case "max_level":
          progress = level == 30 ? 1 : 0;
          break;
        case "building_damage":
          progress = buildingDamage;
          break;
        case "high_fives":
          progress = highFives;
          break;
      }
      await this.incrementQuestProgress(steamID, questID, progress);
    }
  },

  async enterTournament(players) {
    for (steamID of players) {
      try {
        let sql_query = `
        UPDATE players SET in_tournament = TRUE WHERE steam_id = $1 RETURNING *
        `;
        const { rows } = await query(sql_query, [steamID]);

        // If the player did not exist, insert them and run it back
        if (rows.length === 0) {
          await this.createNewPlayer(steamID, "placeholder");
          await query(sql_query, [steamID]);
        }
      } catch (error) {
        throw error;
      }
    }
  },

  async getSubscriptions(steamID) {
    try {
      let sql_query = `
      SELECT * FROM player_subscriptions WHERE steam_id = $1
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getStripeSubscription(steamID) {
    try {
      let sql_query = `
      SELECT customer_id, subscription_status
      FROM player_subscriptions
      WHERE steam_id = $1 AND client = 'stripe'
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getStripeSubscriptionByCustomerID(customerID) {
    try {
      let sql_query = `
      SELECT *
      FROM player_subscriptions
      WHERE customer_id = $1 AND client = 'stripe'
      `;
      const { rows } = await query(sql_query, [customerID]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async addStripeSubscription(steamID, customerID, status) {
    try {
      let sql_query = `
      INSERT INTO player_subscriptions (steam_id, client, customer_id, subscription_status)
      VALUES ($1, $2, $3, $4)
      `;
      await query(sql_query, [steamID, "stripe", customerID, status]);
    } catch (error) {
      throw error;
    }
  },

  async updateStripeSubscription(steamID, status) {
    try {
      let sql_query = `
      UPDATE player_subscriptions set (subscription_status) = $2
      WHERE steam_id = $1
      `;
      await query(sql_query, [steamID, status]);
    } catch (error) {
      throw error;
    }
  },
};
