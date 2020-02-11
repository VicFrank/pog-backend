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

  async getDailyQuestsForPlayer(steamID) {
    try {
      const sql_query = `
      SELECT pq.*, q.*, p.patreon_level,
        quest_progress > required_amount as quest_completed
      FROM player_quests pq
      JOIN quests q
      USING (quest_id)
      JOIN players p
      USING (steam_id)
      WHERE steam_id = $1 AND q.is_achievement = FALSE
      ORDER BY created DESC
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
      SELECT * FROM quests q
      LEFT JOIN player_quests USING (quest_id)
      WHERE q.is_achievement = TRUE AND
        (steam_id = $1 OR steam_id IS NULL)
	    ORDER BY quest_id;
      `;
      const { rows } = await query(sql_query, [steamID]);

      // Filter the achievements to only the ones to show in IO
      // i.e. Highest Tier unclaimed
      // If all tiers are claimed, show final tier

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
        .map(a => [a, Math.random()])
        .sort((a, b) => {
          return a[1] < b[1] ? -1 : 1;
        })
        .slice(0, k)
        .map(a => a[0]);
    }
    return sample;
  },

  /**
   * Creates three random daily quests for the user.
   * Quests are dated as 24 hours ago to allow the user to
   * re-roll them immediately.
   * This function should only be called when a player is
   * created for the first time.
   * @param {string} steamID
   */
  async createInitialDailyQuests(steamID, numQuests) {
    try {
      await query("BEGIN");

      const currentQuests = await this.getDailyQuestsForPlayer(steamID);
      if (currentQuests.length > 0) {
        throw new Error("Player Daily Quests have already been initialized!");
      }

      // Randomly choose three daily quests
      const allQuests = await this.getAllDailyQuests();
      const questsToInsert = this.randomSample(allQuests, numQuests);

      // Add the new quests
      let quests = [];
      for (quest of questsToInsert) {
        const insert_query = `
          INSERT INTO player_quests (steam_id, quest_id) VALUES($1, $2)
          RETURNING *;
        `;
        const { rows } = await query(insert_query, [steamID, quest.quest_id]);
        quests.push(rows[0]);
      }

      await query("COMMIT");
      return quests;
    } catch (error) {
      await query("ROLLBACK");
      throw error;
    }
  },

  /**
   * Removes the given quest, and generates a new one that the player
   * does not already have, and is not the given quest
   */
  async rerollDailyQuest(steamID, questID) {
    try {
      await query("BEGIN");

      // Randomly choose a new quest
      const allQuests = await this.getAllDailyQuests();
      const currentQuests = await this.getDailyQuestsForPlayer(steamID);
      const currentQuestIDs = currentQuests.map(quest => quest.quest_id);

      const newQuests = allQuests.filter(quest => {
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

      // Remove the given quest
      sql_query = `
        DELETE FROM player_quests
        WHERE steam_id = $1 AND quest_id = $2
      `;
      await query(sql_query, [steamID, questID]);

      // Add the new quest
      sql_query = `
        INSERT INTO player_quests (steam_id, quest_id) VALUES($1, $2)
        RETURNING *;
      `;
      const { rows: newQuestRows } = await query(sql_query, [
        steamID,
        questToAddID,
      ]);

      await query("COMMIT");
      return { ...newQuestRows[0], success: true };
    } catch (error) {
      await query("ROLLBACK");
      throw error;
    }
  },

  async playerHasQuest(steamID, questID) {
    const currentQuests = await this.getDailyQuestsForPlayer(steamID);
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

      const questProgress = rows[0].questProgress;
      const required = rows[0].required_amount;
      const claimed = rows[0].claimed;
      const poggers = rows[0].poggers_reward;
      const xp = rows[0].xp_reward;

      if (questProgress < required)
        throw new Error(`Quest is not completed, ${questProgress}/${required}`);
      if (claimed) throw new Error(`Quest has already been claimed`);
      if (!this.playerHasQuest(steamID, questID))
        throw new Error("Player does not have quest");

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
      sql_query = `
        UPDATE player_battle_pass
        SET total_experience = total_experience + $2
        WHERE steam_id = $1
      `;
      await query(sql_query, [steamID, xp]);

      return { xp, poggers, success: true };
    } catch (error) {
      throw error;
    }
  },
};
