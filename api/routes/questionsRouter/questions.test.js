const request = require("supertest");
const app = require("../../app");
const get_db = require("../../db");
const questionsRepository = require("./questions.repository");
const checkJWT = require("../../middleware/checkJWT");
jest.mock("../../middleware/checkJWT");
checkJWT.mockImplementation((req, res, next) => next());

describe("GIVEN that the GET /questions route exists", () => {
  afterAll(async () => {
    const db = await get_db();
    db.end();
  });

  test("GET /questions/1 returns questions by topic and a status 200", async () => {
    const getQuestions = await questionsRepository.getQuestions(1);
    const response = await request(app).get("/questions/1");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(getQuestions);
  });

  test("GET /questions/one returns a 400 bad request error", async () => {
    const response = await request(app).get("/questions/one");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      message: [`\"topicId\" must be a number`],
    });
  });

  test("GET /questions/1000 should return a 404 error message saying ID not found", async () => {
    const response = await request(app).get("/questions/1000");
    const expected = { error: "ID not found" };

    expect(response.status).toBe(404);
    expect(response.body).toEqual(expected);
  });
});
