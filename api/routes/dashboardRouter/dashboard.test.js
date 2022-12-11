const request = require("supertest");
const app = require("../../app");
const get_db = require("../../db");
const { getNewQuestions, getNewAnswers } = require("./dashboard.repository");
const checkJWT = require("../../middleware/checkJWT");
const checkScope = require("../../middleware/checkScope");

jest.mock("../../middleware/checkJWT");
checkJWT.mockImplementation((req, res, next) => next());

jest.mock("../../middleware/checkScope");
checkScope.mockImplementation((req, res, next) => next());

describe("FAQ Dashboard API", () => {
  afterAll(async () => {
    const db = await get_db();
    db.end();
  });

  /* /dashboard should return questions waiting for review or { questions:[] }, with status code of 200*/
  test("GET /dashboard should return questions waiting for review or { questions:[] }, with status code of 200", async () => {
    const expectedData = await getNewQuestions();
    const response = await request(app).get("/dashboard");
    expect(response.body.questions).toEqual(expectedData);
    expect(response.status).toBe(200);
  });

  /* /dashboard should return answers waiting for review or { answers:[] }, with status code of 200*/
  test("GET /dashboard should return answers waiting for review or { answers:[] }, with status code of 200", async () => {
    const expectedData = await getNewAnswers();
    const response = await request(app).get("/dashboard");
    expect(response.body.answers).toEqual(expectedData);
    expect(response.status).toBe(200);
  });

  /* /dashboard should return questions & answers waiting for review, if not should return { questions: [], answers:[] } with status code of 200 */
  test("GET /dashboard should return questions & answers waiting for review, if not should return { questions: [], answers:[] } with status code of 200", async () => {
    let questions = await getNewQuestions();
    let answers = await getNewAnswers();
    const expectedData = { questions, answers };
    const response = await request(app).get("/dashboard");
    questions = response.body.questions;
    answers = response.body.answers;
    const responseBody = { questions, answers };
    expect(responseBody).toEqual(expectedData);
    expect(response.status).toBe(200);
  });
});
