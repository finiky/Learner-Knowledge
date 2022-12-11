const express = require("express");
const router = express.Router();
const Joi = require("joi");
const questionsRepo = require("./editQuestions.respository");
const checkJWT = require("../../middleware/checkJWT");
const checkScope = require("../../middleware/checkScope");

// path parameter validation middleware
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
  questionId: Joi.number().integer().min(1).max(999999998),
});

router.put(
  "/:questionId",
  checkJWT,
  checkScope,
  pathParamValidationMiddleware(pathParamsSchema),
  async (request, response, next) => {
    try {
      const { questionId } = request.params;
      const { starFlag, isStarred, isReviewed } = request.body;
      const question = await questionsRepo.editQuestion(
        questionId,
        starFlag,
        isStarred,
        isReviewed
      );
      if (question) {
        return response.status(200).json({ message: "Edit Successful" });
      }
      if (!question) {
        return response
          .status(404)
          .json({ message: "Invalid request. Question does not exists" });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:questionId",
  pathParamValidationMiddleware(pathParamsSchema),
  checkJWT,
  checkScope,
  async (request, response, next) => {
    try {
      const { questionId } = request.params;
      const result = await questionsRepo.deleteQuestion(questionId);
      if (result) {
        return response.status(200).json({ message: "Question Deleted" });
      }
      if (!result) {
        return response
          .status(404)
          .json({ message: "Invalid request. Question does not exists" });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:questionId",
  pathParamValidationMiddleware(pathParamsSchema),
  checkJWT,
  checkScope,
  async (request, response, next) => {
    const { questionId } = request.params;
    const question = await questionsRepo.getQuestion(questionId);
    if (question) {
      return response.status(200).json(question);
    }
    if (!question) {
      return response
        .status(400)
        .json({ messgae: "Invalid request. Question does not exists." });
    }
  }
);

module.exports = router;
