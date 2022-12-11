const express = require("express");
const router = express.Router();
const Joi = require("joi");
const questionsRepository = require("./questions.repository");
const checkJWT = require("../../middleware/checkJWT");
const pathParamValidationMiddleware = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.params);

  if (error) {
    const { details } = error;
    const message = details.map((detail) => detail.message);

    res.status(400).json({ message: message });
  } else {
    next();
  }
};

const pathParamsSchema = Joi.object().keys({
  topicId: Joi.number().integer().min(1),
});

router.get(
  "/:topicId", checkJWT,
  pathParamValidationMiddleware(pathParamsSchema), 
  async (req, res, next) => {
    try {
      const { topicId } = req.params;
      
      const checkId = await questionsRepository.checkTopicId(topicId);
      if (checkId.rows.length === 0) {
        
        return res.status(404).json({ error: "ID not found" });
      }

      const response = await questionsRepository.getQuestions(topicId);
      return res.json(response).status(200);
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
