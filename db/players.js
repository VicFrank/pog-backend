const { query } = require("./index");
const quests = require("./quests");

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
      await quests.createInitialDailyQuests(steamID, 3);
      await quests.initializeAchievements(steamID);

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
      const battlePass = await this.getBattlePasses(steamID);

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
        battlePass: battlePass,
        achievementsToClaim,
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

  async getGames(steamID, limit = 100, offset = 0, hours) {
    try {
      const sql_query = `
      SELECT *, g.radiant_win = gp.is_radiant as won
      FROM game_players gp
      JOIN games g
      USING (game_id)
      JOIN players p
      USING (steam_id)
      WHERE p.steam_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3;
      `;
      const { rows } = await query(sql_query, [steamID, limit, offset]);
      return rows;
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
      VALUES ($1, $2, $3, $4)
      RETURNING *
      `,
        [steamID, bpName]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async updateBattlePass(steamID, bpName, level, totalExperience) {
    try {
      const { rows } = await query(
        `
      UPDATE player_battle_pass
      SET bp_level = COALESCE($3, bp_level),
          total_experience = COALESCE($4, total_experience)
      WHERE
        steam_id = $1 AND
        bp_name = $2
      RETURNING *
      `,
        [steamID, bpName, level, totalExperience]
      );
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getBattlePasses(steamID) {
    try {
      const sql_query = `
      SELECT *
      FROM player_battle_pass
      WHERE steam_id = $1
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows[0];
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
      `;
      await query(queryText, [amount, steamID]);
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

        if (upgradeTier != undefined && upgradeExpiration) {
          // set the upgrade tier, if possible
          const queryText = `
            UPDATE player_battle_pass
            SET (tier, upgrade_expiration, total_experience)
              = ($2, to_timestamp($3), total_experience + $4)
            WHERE steam_id = $1
          `;
          await query(queryText, [
            steamID,
            upgradeTier,
            upgradeExpiration,
            xpToAdd,
          ]);
        } else {
          const queryText = `
            UPDATE player_battle_pass
            SET total_experience = total_experience + $2
            WHERE steam_id = $1
          `;
          await query(queryText, [steamID, xpToAdd]);
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
      const roll = Math.floor(Math.random() * 100) + 1;

      for (const itemReward of poggerRewards) {
        const { cum_sum, poggers } = itemReward;

        if (cum_sum >= roll) {
          chestPoggers += poggers;
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
};
