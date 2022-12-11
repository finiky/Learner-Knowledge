const express = require("express");
const router = express.Router();
const Joi = require("joi");
const repository = require("./postAnswers.repository");
const checkJWT = require("../../middleware/checkJWT");

// path parameters validation middleware
const pathParamValidationMiddleware = (schema) => (request, response, next) => {
  const { error } = schema.validate(request.params);
  if (error) {
    const { details } = error;
    const message = details.map((detail) => detail.message);
    return response.status(400).json({ message: message });
  } else {
    next();
  }
};
// path parameter schema
const pathParamsSchema = Joi.object().keys({
  questionId: Joi.number().integer().min(1).max(9999998),
});

router.post(
  "/:questionId",
  checkJWT,
  pathParamValidationMiddleware(pathParamsSchema),
  async (req, res, next) => {
    try {
      const { questionId } = req.params;
      const { description } = req.body;

      // checking if description is not a string, an empty string, is undefined, or null
      if (
        typeof description !== "string" ||
        description === "" ||
        description === undefined ||
        description === null
      ) {
        const error = new Error("Bad Request");
        error.status(400);
        throw error;
      }

      await repository.postAnswer(questionId, description);

      // checkId() if result.rows.length === 0, then id not found - 404
      const checkId = await repository.checkQuestionId(questionId);

      if (checkId.length === 0) {
        const error = new Error("Not Found");
        error.status = 404;
        throw error;
      }

      return res
        .status(201)
        .send({ message: "Post has been submitted successfully" });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
