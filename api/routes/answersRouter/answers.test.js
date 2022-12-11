const request = require("supertest");
const app = require("../../app");
const get_db = require("../../db");
const answersRepository = require("./answers.repository");
const checkJWT = require("../../middleware/checkJWT");

jest.mock("../../middleware/checkJWT");
checkJWT.mockImplementation((req, res, next) => next());

describe("GIVEN that the GET /answers route exist", () => {
  afterAll(async () => {
    const db = await get_db();

    db.end();
  });
  // Happy path
  test("GET /answers/:questionId should return all answers with status code 200", async () => {
    const expectedData = await answersRepository.getAnswers(1);
    const response = await request(app).get("/answers/1");
    expect(response.body.rows).toEqual(expectedData.rows);
    expect(response.status).toBe(200);
  });
  test("GET /answers/:questionId should return all answers with status code of 200", async () => {
    const expectedData = await answersRepository.getAnswers(2);
    const response = await request(app).get("/answers/2");
    expect(response.body.rows).toEqual(expectedData.rows);
    expect(response.status).toBe(200);
  });
  // Unhappy path
  test("if GET /answers/:wrongId should return 400 when user input is NOT a number", async () => {
    const response = await request(app).get("/answers/:wrongId");
    expect((response) => {
      expect(response.body[0]).toBe('"questionId" must be a number');
    });
    expect(response.status).toBe(400);
  });

  test("if GET /answers/:wrongId should return 400 when user input is less than 1", async () => {
    const response = await request(app).get("/answers/0");
    expect((response) => {
      expect(response.body[0]).toBe(
        '"questionId" must be greater than or equal to 1'
      );
    });
    expect(response.status).toBe(400);
  });

  test("if GET /answers/:invalidId should return 404", async () => {
    const response = await request(app).get("/answers/123456");
    expect((response) => {
      expect(response.body.error).toBe("ID not found");
    });
    expect(response.status).toEqual(404);
  });
});
