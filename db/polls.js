const { query } = require("./index");

module.exports = {
  async makeNewPoll(name, description, options) {
    try {
      let sql_query = `
      INSERT INTO polls
      (poll_name, poll_description) VALUES ($1, $2)
      RETURNING *
      `;
      const { rows } = await query(sql_query, [name, description]);
      const pollID = rows[0].poll_id;

      for (const pollOption of options) {
        let sql_query = `
        INSERT INTO poll_options
        (poll_id, option_text) VALUES ($1, $2)
        `;
        await query(sql_query, [pollID, pollOption]);
      }
    } catch (error) {
      throw error;
    }
  },

  async getPoll(pollID) {
    try {
      let sql_query = `
      SELECT * FROM polls
      WHERE poll_id = $1
      `;
      const { rows } = await query(sql_query, [pollID]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async getPollResults(pollID) {
    try {
      let sql_query = `
      SELECT * FROM poll_options
      WHERE poll_id = $1
      `;
      const { rows } = await query(sql_query, [pollID]);
      return rows;
    } catch (error) {
      throw error;
    }
  },

  async getVoteForPlayer(steamID, pollID) {
    try {
      let sql_query = `
      SELECT * FROM votes
      WHERE steam_id = $1 AND poll_id = $2
      `;
      const { rows } = await query(sql_query, [steamID, pollID]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  },

  async voteInPoll(steamID, pollID, optionID) {
    try {
      let sql_query = `
      INSERT INTO votes
      (steam_id, poll_id, vote) VALUES
      ($1, $2, $3)
      `;
      await query(sql_query, [steamID, pollID, optionID]);

      sql_query = `
      UPDATE poll_options
      SET votes = votes + 1
      WHERE poll_id = $1 AND option_id = $2
      `;
      await query(sql_query, [pollID, optionID]);
    } catch (error) {
      throw error;
    }
  },
};