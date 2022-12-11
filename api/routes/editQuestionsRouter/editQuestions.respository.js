const get_db = require("../../db");
module.exports = {
  editQuestion: async (questionId, starFlag, isStarred, isReviewed) => {
    try {
      const db = await get_db();
      const question = await db.query(`SELECT * FROM questions WHERE id = $1`, [
        questionId,
      ]);
      if (!question.rows[0]) {
        return false;
      }
      if (starFlag) {
        await db.query(
          `UPDATE questions 
           SET isStarred = $1
           Where id = $2`,
          [isStarred, questionId]
        );
      } else {
        await db.query(
          `UPDATE questions 
           SET isReviewed = $1
           Where id = $2`,
          [isReviewed, questionId]
        );
      }
      return true;
    } catch (error) {
      throw Error(error);
    }
  },
  deleteQuestion: async (questionId) => {
    try {
      const db = await get_db();
      const question = await db.query(`SELECT * FROM questions WHERE id = $1`, [
        questionId,
      ]);
      if (question.rows[0]) {
        await db.query(`DELETE FROM answers WHERE questionid = $1`, [
          questionId,
        ]);
        await db.query(`DELETE FROM questions WHERE id = $1`, [questionId]);
        return true;
      } else return false;
    } catch (error) {
      throw Error(error);
    }
  },

  getQuestion: async (questionId) => {
    try {
      const db = await get_db();
      const result = await db.query(
        `SELECT id, description, isstarred, isreviewed, userid, topicid FROM questions WHERE id = $1`,
        [questionId]
      );
      return result.rows[0];
    } catch (error) {
      throw Error(error);
    }
  },
};
