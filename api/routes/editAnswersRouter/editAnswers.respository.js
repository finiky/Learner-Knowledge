const get_db = require("../../db");
module.exports = {
  editAnswer: async (answerId, starFlag, isStarred, isReviewed) => {
    try {
      const db = await get_db();
      const answer = await db.query(`SELECT * FROM answers WHERE id = $1`, [
        answerId,
      ]);
      if (!answer.rows[0]) {
        return false;
      }
      if (starFlag) {
        await db.query(
          `UPDATE answers 
           SET isStarred = $1
           WHERE id = $2`,
          [isStarred, answerId]
        );
      } else {
        await db.query(
          `UPDATE answers 
           SET isReviewed = $1
           WHERE id = $2`,
          [isReviewed, answerId]
        );
      }
      return true;
    } catch (error) {
      throw Error(error);
    }
  },
  deleteAnswer: async (answerId) => {
    try {
      const db = await get_db();
      const answer = await db.query(`SELECT * FROM answers WHERE id = $1`, [
        answerId,
      ]);
      if (answer.rows[0]) {
        await db.query(`DELETE FROM answers WHERE id = $1`, [answerId]);
        return true;
      } else return false;
    } catch (error) {
      throw Error(error);
    }
  },
  getAnswer: async (answerId) => {
    try {
      const db = await get_db();
      const result = await db.query(
        `SELECT answers.id AS id, answers.description AS description, answers.isstarred AS isstarred, answers.isreviewed AS isreviewed, questionid, answers.userid AS userid, questions.description AS questionDescription FROM 
      answers JOIN questions ON questions.id = answers.questionid WHERE answers.id = $1`,
        [answerId]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error("server down");
    }
  },
};
