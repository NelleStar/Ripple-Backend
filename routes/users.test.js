"use strict";
const request = require("supertest");

const app = require("../app");
const db = require("../db");
const User = require("../models/users")

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/** GET /users - returns {users: [user, ...]} */
describe("GET /users", function () {
  test("works", async function () {
    const response = await request(app).get("/users");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ users: expect.any(Array) })
    );
  });

  test("not found if user doesn't exist", async function () {
    const response = await request(app)
      .patch(`/users/nonexistentuser`)
      .send({ firstName: "New" })
      .set("authorization", `Bearer ${u1Token}`);
    expect(response.statusCode).toBe(404);
  });
});

/** GET /users/:username - returns {user: user} */
describe("GET /users/:username", function () {
  test("works", async function () {
    const response = await request(app).get("/users/user1");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ user: expect.any(Object) })
    );
  });

  test("not found if user doesn't exist", async function () {
    const response = await request(app).get("/users/nonexistentuser");
    expect(response.statusCode).toBe(404);
  });

  test("error if database error occurs", async function () {
    jest.spyOn(User, "get").mockImplementationOnce(() => {
      throw new Error("Database error");
    });

    const response = await request(app).get("/users/user1");
    expect(response.statusCode).toBe(500);
    expect(response.body).toEqual({
      error: {
        message: "Database error",
        status: 500,
      },
    });
    User.get.mockRestore();
  });
});

/** PATCH /users/:username - returns {user: user} */
describe("PATCH /users/:username", function () {
  test("works", async function () {
    const resp = await request(app)
      .patch(`/users/user1`)
      .send({
        firstName: "New",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({
      user: {
        username: "user1",
        firstName: "New",
        lastName: "User1",
        email: "user1@example.com",
        profilePic:
          "https://images.unsplash.com/photo-1556197908-96ed0fa30b65?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    });
  });

  test("not found if user doesn't exist", async function () {
    jest.spyOn(User, "update").mockImplementationOnce(() => {
      throw new Error("User not found");
    });
    const response = await request(app)
      .patch(`/users/nonexistentuser`)
      .send({
        firstName: "New",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(response.statusCode).toBe(404);
  });
});

/** DELETE /users/:username - returns {deleted: username} */
describe("DELETE /users/:username", function () {
  test("works for same user", async function () {
    const resp = await request(app)
      .delete(`/users/user1`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.body).toEqual({ deleted: "user1" });
  });

  test("unauth for anon", async function () {
    const resp = await request(app).delete(`/users/user1`);
    expect(resp.statusCode).toEqual(401);
  });

  test("not found if user missing", async function () {
    const resp = await request(app)
      .delete(`/users/nope`)
      .set("authorization", `Bearer ${u1Token}`);
    expect(resp.statusCode).toEqual(404);
  });
});
