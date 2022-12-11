const request = require("supertest");
const app = require("../../app");
const get_db = require("../../db");
const answerRepo = require("./editAnswers.respository");
const checkJWT = require("../../middleware/checkJWT");
const checkScope = require("../../middleware/checkScope");

jest.mock("../../middleware/checkJWT");
checkJWT.mockImplementation((req, res, next) => next());

jest.mock("../../middleware/checkScope");
checkScope.mockImplementation((req, res, next) => next());

describe("Given that the PUT and DELETE /editAnswer/:answerId route exists", () => {
  afterAll(async () => {
    const db = await get_db();
    db.end();
  });
  // test for PUT requests
  test("WHEN the starFlag is set and isStarred value of the answer for a valid answerId = 1 is edited THEN return status 200. The value of isStarred has been complemented", async () => {
    const db = await get_db();
    //setting the starFlag to true and isStarred to true manually so that the test can prove that it gets changed after the put request
    await answerRepo.editAnswer(1, true, true, true);

    // fetching the isStarred value before the put request
    const isStarredBeforeEdit = await db.query(
      `SELECT isStarred FROM answers WHERE id = 1`
    );

    // fetching the isReviewed value before the put request
    const isReviewedBeforeEdit = await db.query(
      `SELECT isStarred FROM answers WHERE id = 1`
    );

    // body that needs to be sent with the put request
    const body = {
      isStarred: false,
      isReviewed: false,
      starFlag: true,
    };

    // put request made to edit the isStarred value
    await request(app)
      .put("/editanswer/1")
      .send(body)
      .set("Accept", "application/json")
      .expect(200);

    // fetching the isStarred value after the put request has been completed
    const isStarredAfterEdit = await db.query(
      `SELECT isStarred FROM answers WHERE id = 1`
    );

    // fetching the isReviewed value after the put request
    const isReviewedAfterEdit = await db.query(
      `SELECT isStarred FROM answers WHERE id = 1`
    );

    // test to show that the edit actually changed the isStarred field form true to false
    expect(isStarredAfterEdit.rows[0].isstarred).toBe(
      !isStarredBeforeEdit.rows[0].isstarred
    );

    // isReviewed value never changes after the put request
    expect(isReviewedAfterEdit.rows[0].isreviewed).toBe(
      isReviewedBeforeEdit.rows[0].isreviewed
    );
  });

  test("WHEN the starFlag is set to false THEN the isStarred value should not change isReviewed value should change.", async () => {
    const db = await get_db();
    //setting the isReviewed to true, starFlag to false, manually so that the test can prove that it is changed after the put request
    await answerRepo.editAnswer(1, false, true, true);

    // fetching the isReviewed value before the put request
    const isReviewedBeforeEdit = await db.query(
      `SELECT isReviewed FROM answers WHERE id = 1`
    );
    // fetching the isStarred value before the put request
    const isStarredBeforeEdit = await db.query(
      `SELECT isStarred FROM answers WHERE id = 1`
    );

    // body for the put request
    const body = {
      isStarred: false,
      isReviewed: false,
      starFlag: false,
    };

    // making a put request by sending the body
    await request(app)
      .put("/editanswer/1")
      .send(body)
      .set("Accept", "application/json")
      .expect(200);

    // fetching the isReviewed value after the put request
    const isReviewedAfterEdit = await db.query(
      `SELECT isReviewed FROM answers WHERE id = 1`
    );

    // fetching the isReviewed value after the put request
    const isStarredAfterEdit = await db.query(
      `SELECT isStarred FROM answers WHERE id = 1`
    );

    // test to show that the edit actually complemented the isReviewed field form true to false
    expect(isReviewedAfterEdit.rows[0].isreviewed).toBe(
      !isReviewedBeforeEdit.rows[0].isreviewed
    );

    //test to show that put req did not effect the isStarred value of true
    expect(isStarredAfterEdit.rows[0].isstarred).toBe(
      isStarredBeforeEdit.rows[0].isstarred
    );
  });

  test("WHEN the path parameter for answerId is not a number, respond with 400 error code and an appropriate error message", async () => {
    await request(app)
      .put("/editanswer/notAnumber")
      .set("Accept", "application/json")
      .send({
        isStarred: true,
        isReviewed: true,
        starFlad: false,
      })
      .expect(400)
      .expect((response) => {
        expect(response.body.message[0]).toBe(`\"answerId\" must be a number`);
      });
  });

  test("WHEN the path parameter for answerId is less than 1, respond with 400 error code and an appropriate error message", async () => {
    await request(app)
      .put("/editanswer/0")
      .set("Accept", "application/json")
      .send({
        isStarred: true,
        isReviewed: true,
        starFlad: false,
      })
      .expect(400)
      .expect((response) => {
        expect(response.body.message[0]).toBe(
          `\"answerId\" must be greater than or equal to 1`
        );
      });
  });

  test("WHEN the path parameter for answerId is greater than 999999998 as it is not a normal integer anymore, respond with 400 error code and an appropriate error message", async () => {
    await request(app)
      .put("/editanswer/999999999")
      .set("Accept", "application/json")
      .send({
        isStarred: true,
        isReviewed: true,
        starFlad: false,
      })
      .expect(400)
      .expect((response) => {
        expect(response.body.message[0]).toBe(
          `\"answerId\" must be less than or equal to 999999998`
        );
      });
  });

  test("WHEN the path parameter for answerId is not mention. It should give a 404 error status code", async () => {
    await request(app)
      .put("/editanswer/")
      .set("Accept", "application/json")
      .send({
        isStarred: true,
        isReviewed: true,
        starFlad: false,
      })
      .expect(404);
  });

  test("WHEN the path parameter for answerId is valid but not correct as it does not exist in the database THEN It should give a 400 error status code with message", async () => {
    await request(app)
      .put("/editanswer/999999")
      .set("Accept", "application/json")
      .send({
        isStarred: true,
        isReviewed: true,
        starFlad: false,
      })
      .expect(404)
      .expect((response) => {
        expect(response.body.message).toEqual(
          "Invalid request. Answer does not exists"
        );
      });
  });

  //test for DELETE request

  test("WHEN the path parameter for answerId is 10 THEN respond with 200 and Answer Deleted message", async () => {
    await request(app)
      .delete("/editanswer/10")
      .set("Accept", "application/json")
      .expect(200)
      .expect((response) => {
        expect(response.body.message).toBe(`Answer Deleted`);
      });
  });

  test("WHEN the path parameter for answerId is not a number THEN respond with 400 error code and an appropriate error message", async () => {
    await request(app)
      .delete("/editanswer/notAnumber")
      .set("Accept", "application/json")
      .expect(400)
      .expect((response) => {
        expect(response.body.message[0]).toBe(`\"answerId\" must be a number`);
      });
  });

  test("WHEN the path parameter for answerId is less than 1, respond with 400 error code and an appropriate error message", async () => {
    const db = await get_db();
    await request(app)
      .delete("/editanswer/0")
      .set("Accept", "application/json")
      .expect(400)
      .expect((response) => {
        expect(response.body.message[0]).toBe(
          `\"answerId\" must be greater than or equal to 1`
        );
      });
  });

  test("WHEN the path parameter for answerId is greater than 999999998 as it is not a normal integer anymore, respond with 400 error code and an appropriate error message", async () => {
    await request(app)
      .delete("/editanswer/999999999")
      .set("Accept", "application/json")
      .expect(400)
      .expect((response) => {
        expect(response.body.message[0]).toBe(
          `\"answerId\" must be less than or equal to 999999998`
        );
      });
  });

  test("WHEN the path parameter for answerId is not mention. It should give a 404 error status code", async () => {
    await request(app)
      .delete("/editanswer/")
      .set("Accept", "application/json")
      .expect(404);
  });

  test("WHEN the path parameter for answerId is valid but not correct as it does not exist in the database THEN It should give a 400 error status code with message", async () => {
    await request(app)
      .delete("/editanswer/999999")
      .set("Accept", "application/json")
      .expect(404)
      .expect((response) => {
        expect(response.body.message).toEqual(
          "Invalid request. Answer does not exists"
        );
      });
  });

  // test for GET request
  test("WHEN a GET req is made with answerId = 1  THEN retrun a answer object", async () => {
    const expectedOutput = await answerRepo.getAnswer(1);
    const response = await request(app)
      .get("/editanswer/1")
      .set("Accept", "application/json")
      .expect(200);
    expect(response.body).toEqual(expectedOutput);
  });

  test("WHEN the path parameter for answerId is not mention. It should give a 404 error status code", async () => {
    await request(app)
      .get("/editanswer/")
      .set("Accept", "application/json")
      .expect(404);
  });

  test("WHEN the path parameter for answerId is valid but not correct as it does not exist in the database THEN give a 400 error status code with message", async () => {
    await request(app)
      .get("/editanswer/999999")
      .set("Accept", "application/json")
      .expect(400);
  });

  test("WHEN the path parameter for answerId is greater than 999999998 as it is not a normal integer anymore, respond with 400 error code and an appropriate error message", async () => {
    await request(app)
      .get("/editanswer/999999999")
      .set("Accept", "application/json")
      .expect(400)
      .expect((response) => {
        expect(response.body.message[0]).toBe(
          `\"answerId\" must be less than or equal to 999999998`
        );
      });
  });

  test("WHEN the path parameter for answerId is not a number, respond with 400 error code and an appropriate error message", async () => {
    await request(app)
      .get("/editanswer/notAnumber")
      .set("Accept", "application/json")
      .expect(400)
      .expect((response) => {
        expect(response.body.message[0]).toBe(`\"answerId\" must be a number`);
      });
  });

  test("WHEN the path parameter for answerId is less than 1, respond with 400 error code and an appropriate error message", async () => {
    const db = await get_db();
    await request(app)
      .get("/editanswer/0")
      .set("Accept", "application/json")
      .expect(400)
      .expect((response) => {
        expect(response.body.message[0]).toBe(
          `\"answerId\" must be greater than or equal to 1`
        );
      });
  });
});
