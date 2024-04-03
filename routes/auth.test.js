"use strict";
const request = require("supertest");

const app = require("../app");
const db = require("../db.js");
const bcrypt = require("bcrypt")
const User = require("../models/users");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

/************************************** POST /auth/token */

describe("POST /auth/token", function () {
  test("works", async function () {
    const response = await request(app)
      .post("/auth/token")
      .send({
        username: "user1",
        password: "password1",
    });
    expect(response.body).toEqual({
      "token": expect.any(String),
    });
  });

  test("unauth if no such user", async function () {
    const response = await request(app).post("/auth/token").send({
      username: "nope",
      password: "password1",
    });
    expect(response.statusCode).toEqual(401);
  });

  test("unauth if wrong password", async function () {
    const response = await request(app).post("/auth/token").send({
      username: "u1",
      password: "nope",
    });
    expect(response.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const response = await request(app).post("/auth/token").send({
      username: "user1",
    });
  });

  test("unauth if no password provided", async function () {
    const response = await request(app).post("/auth/token").send({
      username: "user1",
    });
    expect(response.statusCode).toEqual(500);
  });

  test("unauth if no username provided", async function () {
    const response = await request(app).post("/auth/token").send({
      password: "password1",
    });
    expect(response.statusCode).toEqual(401);
  });
});

/************************************** POST /auth/register */

describe("POST /auth/register", function () {
  const newUser = {
    username: "new",
    firstName: "New",
    lastName: "User",
    email: "new@user.com",
    password: "newuser123",
  };

  test("works", async function () {
    const response = await request(app).post("/auth/register").send(newUser);
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });

  test("bad request with missing data", async function () {
    const response = await request(app).post("/auth/register").send({
      email: "new@user.com",
      password: "newuser123",
    });
  });

  test("bad request with invalid data", async function () {
    const response = await request(app)
      .post("/auth/register")
      .send({
        ...newUser,
        username: 42,
      });
  });
});

/************************************** POST /auth/login */

describe("POST /auth/login", function () {
  test("works", async function () {
    const response = await request(app).post("/auth/login").send({
      username: "user1",
      password: "password1",
    });
    expect(response.body).toEqual({
      token: expect.any(String),
    });
  });

  test("unauth with non-existent user", async function () {
    const response = await request(app).post("/auth/login").send({
      username: "nope",
      password: "password",
    });
    expect(response.statusCode).toEqual(401);
  });

  test("unauth with wrong password", async function () {
    const response = await request(app).post("/auth/login").send({
      username: "user1",
      password: "nope",
    });
    expect(response.statusCode).toEqual(401);
  });
});
