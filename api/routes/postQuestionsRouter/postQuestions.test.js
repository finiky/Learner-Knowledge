const request = require("supertest");
const app = require("../../app");
const get_db = require("../../db");
const checkJWT = require("../../middleware/checkJWT");
jest.mock("../../middleware/checkJWT");
checkJWT.mockImplementation((req, res, next) => next());

describe("GIVEN that the POST /question/:topicId route exists", () => {
  afterAll(async () => {
    const db = await get_db();
    db.end();
  });

  test("POST /postQuestion/:topicId inserts a new question into the questions table", async () => {
    const db = await get_db();

    const body = {
      description: "test",
    };

    const expectedStatus = 201;

    await request(app)
      .post(`/postquestion/3`)
      .send(body)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toStrictEqual({
          message: "Question has been Posted",
        });
      });

    const updatedQuestionsList = await db.query(
      `SELECT 
      questions.id AS id, 
      questions.description, 
      questions.isstarred, 
      questions.isreviewed, 
      questions.createdon, 
      topicid
      userid
  FROM questions
  ORDER BY questions.createdon DESC`
    );

    expect(updatedQuestionsList.rows[0].description).toBe("test");
  });
  test("WHEN the path parameter for /:topicId is invalid, respond with status code 400", async () => {
    const expectedStatus = 400;
    const body = {
      description: "test",
    };

    await request(app)
      .post(`/postquestion/incorrectId`)
      .send(body)
      .expect(expectedStatus);
  });
  test("WHEN the path parameter for topicId is 0, respond with status code 400 and an appropriate error message", async () => {
    const expectedStatus = 400;

    const body = {
      description: "test",
    };

    await request(app)
      .post(`/postquestion/0`)
      .send(body)
      .expect(expectedStatus);
  });
  test("WHEN the path parameter for topicId is a negative value, respond with status code 400 and an appropriate error message", async () => {
    const expectedStatus = 400;

    const body = {
      description: "test",
    };

    await request(app)
      .post(`/postquestion/-5`)
      .send(body)
      .expect(expectedStatus);
  });
  test("WHEN the path parameter for topicId is great than the max value defined in Joi scheme, respond with status code 404 and an appropriate error message", async () => {
    const expectedStatus = 400;

    const body = {
      description: "test",
    };

    await request(app)
      .post(`/postquestion/99999`)
      .send(body)
      .expect(expectedStatus);
  });
  test("WHEN the path parameter for topicId is not provided, respond with status code 404 and an appropriate error message", async () => {
    const expectedStatus = 404;
    const body = {
      description: "test",
    };

    await request(app).post(`/postquestion/`).send(body).expect(expectedStatus);
  });
});
