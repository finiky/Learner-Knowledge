const express = require("express");
const router = express.Router();
const Joi = require("joi");
const answerRepo = require("./editAnswers.respository");
const checkJWT = require("../../middleware/checkJWT")
const checkScope = require("../../middleware/checkScope");
//path parameters validation middleware
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
  answerId: Joi.number().integer().min(1).max(999999998),
});

router.put(
  "/:answerId",
  pathParamValidationMiddleware(pathParamsSchema), checkJWT, checkScope,
  async (request, response, next) => {
    try {
      const { answerId } = request.params;
      const { starFlag, isStarred, isReviewed } = request.body;
      const answer = await answerRepo.editAnswer(
        answerId,
        starFlag,
        isStarred,
        isReviewed
      );
      if (answer) {
        return response.status(200).json({ message: "Edit Successful" });
      }
      if (!answer) {
        return response
          .status(404)
          .json({ message: "Invalid request. Answer does not exists" });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  "/:answerId",
  pathParamValidationMiddleware(pathParamsSchema), checkJWT, checkScope,
  async (request, response, next) => {
    try {
      const { answerId } = request.params;
      const result = await answerRepo.deleteAnswer(answerId);
      if (result) {
        return response.status(200).json({ message: "Answer Deleted" });
      }
      if (!result) {
        return response
          .status(404)
          .json({ message: "Invalid request. Answer does not exists" });
      }
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/:answerId",
  pathParamValidationMiddleware(pathParamsSchema), checkJWT, checkScope,
  async (request, response, next) => {
    try {
      const { answerId } = request.params;
      const answer = await answerRepo.getAnswer(answerId);
      if (answer) {
        return response.status(200).json(answer);
      }
      if (!answer) {
        return response
          .status(400)
          .json({ messgae: "Invalid request. Answer does not exists." });
      }
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
