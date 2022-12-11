const get_db = require("../../db");

module.exports = {
  getAnswers: async (questionId) => {
    const db = await get_db();
    const getAnswers = await db.query(
      `SELECT answers.id, questions.id AS questionId, questions.description AS questionDescription, answers.description AS answerDescription, answers.isStarred, answers.isReviewed
      FROM questions 
      LEFT JOIN answers 
      ON questions.id = answers.questionid 
      WHERE questions.id = ${questionId}
      ORDER BY answers.isStarred DESC, answers.createdon DESC `
    );
    return getAnswers.rows;
  },
};
