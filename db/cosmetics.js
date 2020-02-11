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
  async createCosmetic(
    entity_name,
    type,
    cost,
    rarity,
    equip_group,
    cosmetic_name
  ) {
    try {
      const sql_query = `
        INSERT INTO cosmetics
        (entity_name, cosmetic_type, cost, rarity, equip_group, cosmetic_name)
        VALUES
        ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const { rows } = await query(sql_query, [
        entity_name,
        type,
        cost,
        rarity,
        equip_group,
        cosmetic_name,
      ]);
      return rows;
    } catch (error) {
      throw error;
    }
  },
};
