const express = require("express");
const app = express();
const cors = require("cors");
const getTopicsRouter = require("./routes/topicsRoute/topics.router");
const getQuestionsRouter = require("./routes/questionsRouter/questions.router");
const postQuestionsRouter = require("./routes/postQuestionsRouter/postQuestions.router");
const getAnswersRouter = require("./routes/answersRouter/answers.router");
const postAnswersRouter = require("./routes/postAnswersRouter/postAnswers.router");
const editQuestionsRouter = require("./routes/editQuestionsRouter/editQuestions.router");
const editAnswersRouter = require("./routes/editAnswersRouter/editAnswers.router");
const dashboardRouter = require("./routes/dashboardRouter/dashboard.router");
const usersRouter = require("./routes/usersRouter/users.router");

app.use(cors());
app.use(express.json());

//routes
app.use("/topics", getTopicsRouter);
app.use("/questions", getQuestionsRouter);
app.use("/postquestion", postQuestionsRouter);
app.use("/answers", getAnswersRouter);
app.use("/postanswer", postAnswersRouter);
app.use("/editquestion", editQuestionsRouter);
app.use("/editanswer", editAnswersRouter);
app.use("/dashboard", dashboardRouter);
app.use("/users", usersRouter);

//error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
  });
});

module.exports = app;
