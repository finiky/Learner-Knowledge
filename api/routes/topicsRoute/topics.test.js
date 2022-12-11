const request = require("supertest");
const app = require("../../app");
const get_db = require("../../db");
const repository = require("./topics.repository");
const checkJWT = require("../../middleware/checkJWT");
jest.mock("../../middleware/checkJWT");
checkJWT.mockImplementation((req, res, next) => next());

describe("GET /topics route", () => {
  afterAll(async () => {
    const db = await get_db();
    db.end();
  });

  test("return status 200 and an array of topics from the DB", async () => {
    repository.getTopics = jest.fn();
    repository.getTopics.mockReturnValue([{ year: "Year 1" }]);
    const response = await request(app)
      .get("/topics")
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ year: "Year 1" }]);
  });

  test("return status 200 and an array of topics from the DB", async () => {
    const expectedResponseData = await repository.getTopics();
    const response = await request(app)
      .get("/topics")
      .set("Accept", "application/json");
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expectedResponseData);
  });
});
