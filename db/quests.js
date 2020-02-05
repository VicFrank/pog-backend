const { query } = require("./index");

module.exports = {
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

  async addNewQuest(
    isAchievement,
    name,
    description,
    poggers,
    xp,
    stat,
    requiredAmount,
    title
  ) {
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
      SELECT * FROM player_quests pq
      JOIN quests q
      USING (quest_id)
      WHERE steam_id = $1 AND q.is_achievement = FALSE
      `;
      const { rows } = await query(sql_query, [steamID]);
      return rows;
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
      return rows;
    } catch (error) {
      throw error;
    }
  },

  // Removes the given quest, and generates a new one that the player
  // does not already have, and is not the given quest
  async rerollDailyQuest(steamID, quest_id) {
    try {
      await query("BEGIN");

      // Randomly choose a new quest
      const allQuests = getAllDailyQuests();
      const currentQuests = getDailyQuestsForPlayer(steamID);
      const currentQuestIDs = currentQuests.map(quest => quest.quest_id);

      const newQuests = allQuests.filter(quest => {
        return currentQuestIDs.contains(quest.quest_id);
      });

      const questToAdd =
        newQuests[Math.floor(Math.random() * newQuests.length)];
      const questToAddID = questToAdd.quest_id;

      // Remove the given quest
      // TODO: return created and make sure it was >= 24 hours ago
      const remove_query = `
        WITH deleted AS
        (DELETE FROM player_quests
        WHERE steam_id = $1 AND quest_id = $2
        RETURNING *)
        SELECT count(*) FROM deleted;
      `;
      const { rows } = await query(remove_query, [steamID, quest_id]);
      if (rows[0].count === 0) {
        throw new Error(`Tried to reroll invalid Quest ID ${quest_id}`);
      }

      // Add the new quest
      const insert_query = `
        INSERT INTO player_quests (steam_id, quest_id) VALUES($1, $2)
        RETURNING *;
      `;
      const { rows: rows2 } = await query(insert_query, [
        steamID,
        questToAddID,
      ]);

      await query("COMMIT");
      return rows2[0];
    } catch (error) {
      await query("ROLLBACK");
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
          "Sample size must be less than or equal to array length         when sampling without replacement."
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

      const currentQuests = getDailyQuestsForPlayer(steamID);
      if (currentQuests.length > 0) {
        throw new Error("Player Daily Quests have already been initialized!");
      }

      // Randomly choose three daily quests
      const allQuests = getAllDailyQuests();
      const questsToInsert = this.randomSample(allQuests, numQuests);

      // Add the new quests
      for (quest of questsToInsert) {
        const insert_query = `
          INSERT INTO player_quests (steam_id, quest_id) VALUES($1, $2)
          RETURNING *;
        `;
        await query(insert_query, [steamID, quest.quest_id]);
      }

      await query("COMMIT");
      return rows[0];
    } catch (error) {
      await query("ROLLBACK");
      throw error;
    }
  },

  /**
   * Claims the poggers/xp for a completed quest/achievement.
   * Only claims if the player has made enough progress to claim
   * */
  async claimQuestReward(steamID, quest_id) {
    try {
      let sql_query = `
        SELECT pq.quest_progress, pq.claimed, q.required_amount,
          q.poggers_reward, q.xp_reward
        FROM player_quests pq
        JOIN quests q
        USING (quest_id)
        WHERE steam_id = $1 AND quest_id = $2
      `;
      let { rows } = await query(sql_query, [steamID, quest_id]);

      if (rows.length === 0) {
        throw new Error(`Invalid Quest ID ${quest_id}`);
      }

      const questProgress = rows[0].questProgress;
      const required = rows[0].required_amount;
      const claimed = rows[0].claimed;
      const poggers = rows[0].poggers_reward;
      const xp = rows[0].xp_reward;

      if (questProgress < required) {
        throw new Error(`Quest is not completed, ${questProgress}/${required}`);
      }

      if (claimed) {
        throw new Error(`Quest has already been claimed`);
      }

      // Set the quest as claimed
      sql_query = `
        UPDATE player_quests
        SET claimed = TRUE
        WHERE steam_id = $1 AND quest_id = $2
      `;
      await query(sql_query, [steamID, quest_id]);

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

      return;
    } catch (error) {
      throw error;
    }
  },
};
