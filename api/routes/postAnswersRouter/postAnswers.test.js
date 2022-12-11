const request = require("supertest");
const app = require("../../app");
const get_db = require("../../db");
const repository = require("./postAnswers.repository");
const checkJWT = require("../../middleware/checkJWT");

jest.mock("../../middleware/checkJWT");
checkJWT.mockImplementation((req, res, next) => next());

describe("GIVEN that the POST /postanswer/:questionId route exists", () => {
  afterAll(async () => {
    const db = await get_db();
    db.end();
  });

  test("POST /postanswer/:questionId creates a newly posted answer for a question", async () => {
    const db = await get_db();

    // body to be compared with the newly posted answer
    const body = {
      description: "test",
    };

    const expectedStatus = 201;

    await request(app)
      .post(`/postanswer/5`)
      .send(body)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toStrictEqual({
          message: "Post has been submitted successfully",
        });
      });

    // selects all the answers with the newly posted answer to be showing in the first array at [0]
    const updatedAnswersList = await db.query(
      `SELECT 
            answers.id AS answer_id, 
            answers.description, 
            answers.isstarred, 
            answers.isreviewed, 
            answers.createdon, 
            questionid 
        FROM answers
        ORDER BY answers.createdon DESC`
    );

    // comparing the first index of the array to match 'test' description
    expect(updatedAnswersList.rows[0].description).toBe("test");
  });

  test("WHEN the path parameter for /:questionId is more than 9999998, which means it does not exist within the database, respond with status code 400 and an appropriate error message", async () => {
    const expectedStatus = 400;

    const body = {
      description: "test",
    };

    await request(app)
      .post("/postanswer/9999999")
      .send(body)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toStrictEqual({
          message: ['"questionId" must be less than or equal to 9999998'],
        });
      });
  });

  test("WHEN the path parameter for /:questionId is a string, respond with status code 400 and an appropriate error message", async () => {
    const expectedStatus = 400;

    const body = {
      description: "test",
    };

    await request(app)
      .post("/postanswer/incorrectId")
      .send(body)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toStrictEqual({
          message: ['"questionId" must be a number'],
        });
      });
  });

  test("WHEN the path parameter for questionId is 0, respond with status code 400 and an appropriate error message", async () => {
    const expectedStatus = 400;

    const body = {
      description: "test",
    };

    await request(app)
      .post("/postanswer/0")
      .send(body)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toStrictEqual({
          message: ['"questionId" must be greater than or equal to 1'],
        });
      });
  });

  test("WHEN the path parameter for questionId is a negative value, respond with status code 400 and an appropriate error message", async () => {
    const expectedStatus = 400;

    const body = {
      description: "test",
    };

    await request(app)
      .post("/postanswer/-5")
      .send(body)
      .expect(expectedStatus)
      .expect((response) => {
        expect(response.body).toStrictEqual({
          message: ['"questionId" must be greater than or equal to 1'],
        });
      });
  });

  test("WHEN the path parameter for questionId is not provided, respond with status code 404", async () => {
    const expectedStatus = 404;

    const body = {
      description: "test",
    };

    await request(app).post("/postanswer/").send(body).expect(expectedStatus);
  });
});
