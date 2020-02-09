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
        SELECT * FROM cosmetics WHERE cost > 0 AND exclusive = FALSE`;
      const { rows } = await query(sql_query);
      return rows;
    } catch (error) {
      throw error;
    }
  },
  async createCosmetic(name, type, cost, rarity, equip_group, english_name) {
    try {
      if (!english_name) english_name = name;

      const sql_query = `
        INSERT INTO cosmetics
        (cosmetic_name, cosmetic_type, cost, rarity, equip_group, english_name)
        VALUES
        ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const { rows } = await query(sql_query, [
        name,
        type,
        cost,
        rarity,
        equip_group,
        english_name,
      ]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
};
