const get_db = require("../../db");

// export postAnswer function that adds a new POST to the answers table with a given questionId and description
// export checkQuestionId function that selects a question based on a given id

module.exports = {
  postAnswer: async (questionId, description) => {
    const db = await get_db();
    const result = await db.query(
      `INSERT INTO answers (questionId, description)
      VALUES($1, $2)`,
      [questionId, description]
    );

    return result.rows;
  },

  checkQuestionId: async (questionId) => {
    const db = await get_db();
    const result = await db.query(
      `SELECT id FROM questions
      WHERE id = $1`,
      [questionId]
    );

    return result.rows;
  },
};
