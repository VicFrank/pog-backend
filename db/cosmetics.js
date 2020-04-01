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
  async getBattlePass() {
    try {
      const sql_query = `
      SELECT
        bp_level,
        cosmetic_id,
        chest,
        chest_amount
      FROM battle_pass_levels
      ORDER BY bp_level`;
      const { rows } = await query(sql_query);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async createBattlePassLevel(level, cosmeticID, chest, chestAmount) {
    const version = 1;
    try {
      const sql_query = `
        INSERT INTO battle_pass_levels
        (bp_version, bp_level, cosmetic_id, chest, chest_amount)
        VALUES
        ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const { rows } = await query(sql_query, [
        version,
        level,
        cosmeticID,
        chest,
        chestAmount,
      ]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
};
