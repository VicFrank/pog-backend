const { query } = require("./index");

module.exports = {
  async getAllCosmetics() {
    try {
      const sql_query = `SELECT * FROM cosmetics`;
      const { rows } = await query(sql_query);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getCosmetic(cosmeticID) {
    try {
      const sql_query = `SELECT * FROM cosmetics WHERE cosmetic_id = $1`;
      const { rows } = await query(sql_query, [cosmeticID]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
  async getPurchaseableCosmetics() {
    try {
      const sql_query = `
        SELECT * FROM cosmetics WHERE cost > 0`;
      const { rows } = await query(sql_query);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async createCosmetic(cost, cosmetic_id, rarity, type, equip_group) {
    try {
      const sql_query = `
        INSERT INTO cosmetics
        (cosmetic_type, cost, rarity, equip_group, cosmetic_id)
        VALUES
        ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const { rows } = await query(sql_query, [
        type,
        cost,
        rarity,
        equip_group,
        cosmetic_id,
      ]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async createItemPrice(cost_usd, item_id, type, reward) {
    try {
      const sql_query = `
        INSERT INTO item_prices
        (cost_usd, item_id, item_type, reward)
        VALUES
        ($1, $2, $3, $4)
        RETURNING *
      `;
      const { rows } = await query(sql_query, [
        cost_usd,
        item_id,
        type,
        reward,
      ]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getItemPrices() {
    try {
      const sql_query = `
        SELECT * FROM item_prices
      `;
      const { rows } = await query(sql_query);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getItemPrice(itemID) {
    try {
      const sql_query = `
        SELECT * FROM item_prices
        WHERE item_id = $1
      `;
      const { rows } = await query(sql_query, [itemID]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
  async getBattlePass() {
    try {
      const sql_query = `
      SELECT *
      FROM battle_pass_levels
      ORDER BY bp_level`;
      const { rows } = await query(sql_query);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getBattlePassRewardsFromRange(minLevel, maxLevel) {
    try {
      const sql_query = `
      SELECT *
      FROM battle_pass_levels
      WHERE bp_level >= $1 AND
        bp_level <= $2
      `;
      const { rows } = await query(sql_query, [minLevel, maxLevel]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  /**
   * Expects a battle pass from getBattlePass, ordered by level
   * Calculates what level you would be at given a certain amount
   * of xp. Past 100, it takes 8000 xp to level up
   * @param {*} battlePass
   * @param {*} totalXP
   */
  calculateBattlePassLevel(battlePass, totalXP) {
    let lastLevel = 0;
    for (const level of battlePass) {
      const { total_xp } = level;
      if (totalXP < total_xp) {
        return lastLevel;
      }
      lastLevel++;
    }

    const level100TotalXP = battlePass[lastLevel - 1].total_xp;
    const overflowXP = totalXP - level100TotalXP;

    return 100 + Math.floor(overflowXP / 8000);
  },
  async createBattlePassLevel(
    level,
    cosmeticID,
    chest,
    chestAmount,
    next_level_xp,
    total_xp
  ) {
    const version = 1;
    try {
      const sql_query = `
        INSERT INTO battle_pass_levels
        (bp_version, bp_level, cosmetic_id, chest, chest_amount, next_level_xp, total_xp)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      const { rows } = await query(sql_query, [
        version,
        level,
        cosmeticID,
        chest,
        chestAmount,
        next_level_xp,
        total_xp,
      ]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getBattlePassLevel(level) {
    try {
      const sql_query = `
        SELECT * FROM battle_pass_levels
        WHERE bp_level = $1
      `;
      const { rows } = await query(sql_query, [level]);

      // If the level doesn't exist, they're above level 100
      if (rows.length === 0) {
        let total_xp = 0;
        let next_level_xp = 0;
        if (level > 100) {
          total_xp = 372125 + 8000 * (level - 99);
          next_level_xp = 8000;
        }

        return {
          bp_version: 1,
          bp_level: level,
          next_level_xp,
          total_xp,
        };
      }
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
  async addChestItemReward(chestID, rarity, odds) {
    try {
      const sql_query = `
        INSERT INTO chest_item_rewards
        (cosmetic_id, reward_rarity, reward_odds)
        VALUES
        ($1, $2, $3)
        RETURNING *
      `;
      const { rows } = await query(sql_query, [chestID, rarity, odds]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async addChestPoggersReward(chestID, poggers, cumSum) {
    try {
      const sql_query = `
        INSERT INTO chest_pogger_rewards
        (cosmetic_id, poggers, cum_sum)
        VALUES
        ($1, $2, $3)
        RETURNING *
      `;
      const { rows } = await query(sql_query, [chestID, poggers, cumSum]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async addChestBonusReward(chestID, reward, cumSum) {
    try {
      const sql_query = `
        INSERT INTO chest_bonus_rewards
        (cosmetic_id, reward_id, cum_sum)
        VALUES
        ($1, $2, $3)
        RETURNING *
      `;
      const { rows } = await query(sql_query, [chestID, reward, cumSum]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async getAllChestRewards() {
    try {
      const { rows: itemRewards } = await query(
        `SELECT * FROM chest_item_rewards`
      );
      const { rows: poggerRewards } = await query(
        `SELECT * FROM chest_pogger_rewards`
      );
      const { rows: bonusRewards } = await query(
        `SELECT * FROM chest_bonus_rewards`
      );
      return [...itemRewards, ...poggerRewards, ...bonusRewards];
    } catch (error) {
      throw error;
    }
  },
  async getPotentialChestRewards(chestID) {
    try {
      const {
        rows: itemRewards,
      } = await query(
        `SELECT * FROM chest_item_rewards WHERE cosmetic_id = $1`,
        [chestID]
      );
      const {
        rows: poggerRewards,
      } = await query(
        `SELECT * FROM chest_pogger_rewards WHERE cosmetic_id = $1`,
        [chestID]
      );
      const {
        rows: bonusRewards,
      } = await query(
        `SELECT * FROM chest_bonus_rewards WHERE cosmetic_id = $1`,
        [chestID]
      );
      return [...itemRewards, ...poggerRewards, ...bonusRewards];
    } catch (error) {
      throw error;
    }
  },
};
