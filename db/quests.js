const { query } = require("./index");

module.exports = {
  async getAllQuests() {
    try {
      const sql_query = `SELECT * FROM quests`;
      const { rows } = await query(sql_query);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getAllDailyQuests() {
    try {
      const sql_query = `
      SELECT * FROM quests
      WHERE is_achievement = FALSE
      `;
      const { rows } = await query(sql_query);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getAllAchievements() {
    try {
      const sql_query = `
      SELECT * FROM quests
      WHERE is_achievement = TRUE
      `;
      const { rows } = await query(sql_query);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getAllQuestsWithStat(stat) {
    try {
      const sql_query = `
      SELECT * FROM quests
      WHERE stat = $1
      `;
      const { rows } = await query(sql_query, [stat]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Creates a new quest, either a daily quest or achievement
   * @param {*} QuestValues
   */
  async addNewQuest({
    name,
    isAchievement,
    description,
    poggers,
    xp,
    stat,
    requiredAmount,
    title,
  }) {
    try {
      const sql_query = `
      INSERT INTO quests (quest_name, is_achievement, quest_description,
        poggers_reward, xp_reward, stat, required_amount, title_reward)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
      `;
      const { rows } = await query(sql_query, [
        name,
        isAchievement,
        description,
        poggers,
        xp,
        stat,
        requiredAmount,
        title,
      ]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  /**
   * Gets the active daily quests for a player.
   * Returns two quests for patreon level 0, and three
   * for higher
   * @param {String} steamID
   */
  async getDailyQuestsForPlayer(steamID) {
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
      WHERE steam_id = $1 AND q.is_achievement = FALSE
      ORDER BY quest_index DESC
      `;
      const { rows } = await query(sql_query, [steamID]);

      if (rows[0] && rows[0].patreon_level === 0) {
        return rows.slice(0, 2);
      } else {
        return rows.slice(0, 3);
      }
    } catch (error) {
      throw error;
    }
  },

  async getAchievementsForPlayer(steamID) {
    try {
      const sql_query = `
      SELECT *,
        LEAST(quest_progress, required_amount) as capped_quest_progress,
        quest_progress >= required_amount as quest_completed
      FROM quests q
      JOIN player_quests USING (quest_id)
      WHERE q.is_achievement = TRUE AND
        steam_id = $1
	    ORDER BY quest_id
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Only shows the highest active tier of achievements
   * @param {String} steamID
   */
  async getActiveAchievementsForPlayer(steamID) {
    try {
      const sql_query = `
      SELECT *,
        LEAST(quest_progress, required_amount) as capped_quest_progress,
        quest_progress >= required_amount as quest_completed
      FROM quests q
      JOIN player_quests USING (quest_id)
      WHERE q.is_achievement = TRUE AND
        steam_id = $1
	    ORDER BY quest_id
      `;
      const { rows } = await query(sql_query, [steamID]);

      // Group by stat
      let stats = new Set();
      for (let quest of rows) {
        const { stat } = quest;
        stats.add(stat);
      }

      let activeAchievements = [];
      for (let stat of stats) {
        // Get the highest achievement of this stat that is not claimed
        let statQuests = rows.filter((quest) => quest.stat == stat);
        statQuests.sort((q1, q2) => q1.required_amount - q2.required_amount);

        let questToAdd;
        for (let quest of statQuests) {
          if (!quest.claimed) {
            questToAdd = quest;
            break;
          }
        }
        if (!questToAdd) questToAdd = statQuests.slice(-1).pop();

        activeAchievements.push(questToAdd);
      }

      return activeAchievements;
    } catch (error) {
      throw error;
    }
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
            ? Object.values(itemPurchases).indexOf("item_nokrash_blade") > -1
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
