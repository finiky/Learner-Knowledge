const get_db = require("./db");

describe("API to DB connection", () => {
  afterAll(async () => {
    const db = await get_db();
    db.end();
  });

  test("should be active", async () => {
    const db = await get_db();
    const result = await db.query(``);
    expect(result.rows).toStrictEqual([]);
  });
});
