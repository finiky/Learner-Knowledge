const get_db = require("../../db");

module.exports = {
  getQuestions: async (topicId) => {
    try {
      const db = await get_db();
      const getQuestions = await db.query(
        `SELECT questions.id, description, topicId, isStarred, isReviewed, topics.name  
      FROM questions
      RIGHT JOIN topics
      ON questions.topicId = topics.id
      WHERE topics.id = ${topicId}
      ORDER BY isStarred DESC, questions.createdon DESC`
      );

      return getQuestions.rows;
    } catch (error) {
      next(error);
    }
  },

  checkTopicId: async (topicId) => {
    try {
      const db = await get_db();
      const checkTopicId = await db.query(
        `SELECT id FROM topics WHERE id = $1`,
        [topicId]
      );

      return checkTopicId;
    } catch (error) {
      next(error);
    }
  },
};
