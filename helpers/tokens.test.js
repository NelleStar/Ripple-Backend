const request = require("supertest");
const jwt = require("jsonwebtoken");
const { createToken } = require("./tokens");
const { SECRET_KEY } = require("../config");

const db = require("../db");

describe("createToken", function () {
  test("works", function () {
    const token = createToken({ username: "user1" });
    const payload = jwt.verify(token, SECRET_KEY);
    expect(payload).toEqual({
      iat: expect.any(Number),
      username: "user1",
    });
  });
});

afterAll(function () {
  db.end();
});