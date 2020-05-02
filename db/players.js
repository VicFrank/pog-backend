const { query } = require("./index");
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
      select exists(select 1 from players where steam_id=$1)
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows[0].exists;
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

      const equippedCompanion = await this.getEquippedCompanion(steamID);
      const teamKillStats = await this.getTeamKillStats(steamID);
      const dailyQuests = await quests.getDailyQuestsForPlayer(steamID);
      const achievements = await quests.getAchievementsForPlayer(steamID);
      const battlePass = await this.getPlayerBattlePass(steamID);
      const battlePassLevel = await cosmetics.getBattlePassLevel(
        battlePass.bp_level
      );

      let buildings_destroyed = teamKillStats.buildingKills.buildings_destroyed;
      let guardian_kills = teamKillStats.guardianKills.guardian_kills;

      const achievementsToClaim = achievements.filter((achievement) => {
        return achievement.quest_completed && !achievement.claimed;
      }).length;

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

      return {
        ...playerStats,
        buildings_destroyed,
        guardian_kills,
        companion: equippedCompanion,
        dailyQuests: dailyQuests,
        battlePass: { ...battlePass, ...battlePassLevel },
        achievementsToClaim,
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
      SELECT *, g.radiant_win = gp.is_radiant as won
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
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows;
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

  async getPlayerBattlePass(steamID) {
    try {
      const sql_query = `
      SELECT steam_id, bp_version, bp_level, total_experience, upgrade_expiration,
      (case when upgrade_expiration > NOW() then tier else 0 end) as tier
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

  async givePostGameBP(steamID, winner) {
    /*
      BASELINE:
      50 XP per win (capped at 20 wins)
      200 XP bonus for the first win of the day (250 total)

      SILVER ACCELERATOR:
      100 XP per win (capped at 20 wins)
      300 XP bonus for the first win of the day (400 total)

      GOLD ACCELERATOR:
      200 XP per win (capped at 20 wins)
      400 XP bonus for the first win of the day (600 total)
    */
    try {
      const games = await this.getBasicGames(steamID, 100, 0, 24);

      let numRecentGames = 0;
      for (let game of games) {
        if (game.won) {
          numRecentGames += 1;
        } else {
          numRecentGames += 0.5;
        }
      }

      const { tier } = await this.getPlayerBattlePass(steamID);
      let reward = 0;

      if (numRecentGames > 20) {
        return;
      } else if (numRecentGames === 0) {
        reward = 250;
        if (tier === 1) {
          reward = 400;
        } else if (tier === 2) {
          reward = 600;
        }
      } else {
        reward = 50;
        if (tier === 1) {
          reward = 100;
        } else if (tier === 2) {
          reward = 200;
        }
      }

      if (!winner) {
        reward = reward * 0.5;
      }

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

  async getPlayerCosmetics(steamID, onlyEquipped = false) {
    try {
      const filter = onlyEquipped ? "AND equipped = TRUE" : "";
      const sql_query = `
      SELECT *
      FROM player_cosmetics
      JOIN cosmetics
      USING (cosmetic_id)
      WHERE steam_id = $1
      ${filter}
      `;
      const { rows } = await query(sql_query, [steamID]);
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
      const filter = onlyEquipped ? "AND equipped = TRUE" : "";
      const sql_query = `
      SELECT *
      FROM player_companions
      JOIN cosmetics
      USING (cosmetic_id)
      WHERE steam_id = $1
      ${filter}
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getEquippedCompanion(steamID) {
    try {
      const sql_query = `
      SELECT *
      FROM player_companions
      JOIN cosmetics
      USING (cosmetic_id)
      WHERE steam_id = $1 AND equipped = TRUE
      `;
      const { rows } = await query(sql_query, [steamID]);
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
        WHERE companion_id  = $1
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
      await query("BEGIN");

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
        const { upgradeTier, upgradeExpiration, bonusExp } = battlePass;

        const xpToAdd = bonusExp || 0;

        if (xpToAdd != 0) {
          await this.addBattlePassExp(steamID, xpToAdd);
        }

        if (upgradeTier != undefined && upgradeExpiration) {
          // set the upgrade tier, if possible
          const queryText = `
            UPDATE player_battle_pass
            SET (tier, upgrade_expiration)
              = ($2, to_timestamp($3))
            WHERE steam_id = $1
          `;
          await query(queryText, [steamID, upgradeTier, upgradeExpiration]);
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

      await query("COMMIT");
    } catch (error) {
      await query("ROLLBACK");
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

      const currentBattlePass = await this.getPlayerBattlePass(steamID);
      const { tier } = currentBattlePass;
      let result;

      if (tier == 0) {
        // No problem here, just upgrade the battle pass and have it expire in a month
        const queryText = `
          UPDATE player_battle_pass
          SET (tier, upgrade_expiration)
            = ($2, NOW() + '1 MONTH')
          WHERE steam_id = $1
          RETURNING *
        `;
        const { rows } = await query(queryText, [steamID, upgradeTier]);
        result = rows[0];
      } else if (tier == 1) {
        if (upgradeTier == 1) {
          // Same tier, extend the deadline by a month
          const queryText = `
            UPDATE player_battle_pass
            SET (tier, upgrade_expiration)
              = ($2, upgrade_expiration + '1 MONTH')
            WHERE steam_id = $1
            RETURNING *
          `;
          const { rows } = await query(queryText, [steamID, upgradeTier]);
          result = rows[0];
        } else if (upgradeTier == 2) {
          // ignore the old deadline because we're upgrading the battle pass
          const queryText = `
            UPDATE player_battle_pass
            SET (tier, upgrade_expiration)
              = ($2, NOW() + '1 MONTH')
            WHERE steam_id = $1
            RETURNING *
          `;
          const { rows } = await query(queryText, [steamID, upgradeTier]);
          result = rows[0];
        }
      } else if (tier == 2) {
        if (upgradeTier == 1) {
          throw new Error("You can't downgrade your battlepass");
        } else {
          // Same tier, extend the deadline by a month
          const queryText = `
            UPDATE player_battle_pass
            SET (tier, upgrade_expiration)
              = ($2, upgrade_expiration + '1 MONTH')
            WHERE steam_id = $1
            RETURNING *
          `;
          const { rows } = await query(queryText, [steamID, upgradeTier]);
          result = rows[0];
        }
      }

      await this.removeCosmetic(steamID, cosmeticID);

      return result;
    } catch (error) {
      throw error;
    }
  },

  async buyCosmetic(steamID, cosmeticID) {
    try {
      await query("BEGIN");
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

      await query("COMMIT");
    } catch (error) {
      await query("ROLLBACK");
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
                  pityPoggers += 50;
                  break;
                case "Uncommon":
                  pityPoggers += 100;
                  break;
                case "Rare":
                  pityPoggers += 200;
                  break;
                case "Mythical":
                  pityPoggers += 500;
                  break;
                case "Legendary":
                  pityPoggers += 1000;
                  break;
              }
            }
          }
          reward_odds -= 100;
        }
      }

      let chestPoggers = 0;
      chestPoggers += pityPoggers;

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
        poggers: chestPoggers,
        items,
        companions,
      };

      // add the rewards to the player
      await this.itemTransaction(steamID, transaction);

      return {
        items: chestItems,
        poggers: chestPoggers,
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
      await query("BEGIN");

      const currentQuests = await quests.getDailyQuestsForPlayer(steamID);
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

      await query("COMMIT");
      return newQuests;
    } catch (error) {
      await query("ROLLBACK");
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

  /**
   * Removes the given quest, and generates a new one that the player
   * does not already have, and is not the given quest
   * @param {string} steamID
   * @param {number} questID
   */
  async rerollDailyQuest(steamID, questID) {
    try {
      await query("BEGIN");

      // Randomly choose a new quest
      const allQuests = await quests.getAllDailyQuests();
      const currentQuests = await quests.getAllDailyQuestsForPlayer(steamID);
      const currentQuestIDs = currentQuests.map((quest) => quest.quest_id);

      const newQuests = allQuests.filter((quest) => {
        return !currentQuestIDs.includes(quest.quest_id);
      });

      const questToAdd =
        newQuests[Math.floor(Math.random() * newQuests.length)];
      const questToAddID = questToAdd.quest_id;

      // Make sure the player has the quest, and that it's at least 24 hours old
      let sql_query = `
      SELECT
      created < current_timestamp - interval '23 hours' as can_reroll
      FROM player_quests
      WHERE steam_id = $1 AND quest_id = $2
      `;
      const { rows: createdRows } = await query(sql_query, [steamID, questID]);
      if (createdRows.length === 0)
        throw new Error(`Player does not have quest with ID ${questID}`);
      if (!createdRows[0].can_reroll)
        throw new Error(`Can't reroll quest younger than 23 hours`);

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

      await query("COMMIT");
      return { ...newQuestRows[0], success: true };
    } catch (error) {
      await query("ROLLBACK");
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
    const currentQuests = await quests.getDailyQuestsForPlayer(steamID);
    for (let quest of currentQuests) {
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
      await query("BEGIN");
      // Get the quest rewards and requirements for the DB,
      // and make sure the quest is actually complete
      let sql_query = `
        SELECT pq.quest_progress, pq.claimed, q.required_amount,
          q.poggers_reward, q.xp_reward
        FROM player_quests pq
        JOIN quests q
        USING (quest_id)
        WHERE steam_id = $1 AND quest_id = $2
      `;
      const { rows } = await query(sql_query, [steamID, questID]);

      if (rows.length === 0) {
        throw new Error(`Invalid Quest ID ${questID}`);
      }

      const questProgress = rows[0].quest_progress;
      const required = rows[0].required_amount;
      const claimed = rows[0].claimed;
      const poggers = rows[0].poggers_reward;
      const xp = rows[0].xp_reward;

      if (questProgress < required)
        throw new Error(`Quest is not completed, ${questProgress}/${required}`);
      if (claimed) throw new Error(`Quest has already been claimed`);
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

      // Add the rewarded poggers
      sql_query = `
        UPDATE players
        SET poggers = poggers + $2
        WHERE steam_id = $1
      `;
      await query(sql_query, [steamID, poggers]);

      // Add the rewarded xp to the battle pass
      await this.addBattlePassExp(steamID, xp);

      await query("COMMIT");
      return { xp, poggers, success: true };
    } catch (error) {
      await query("ROLLBACK");
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
};
