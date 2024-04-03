"use strict";
const request = require("supertest");

const db = require("../db");
const bcrypt = require("bcrypt");
const User = require("./users");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const {  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

// ==============authenticate===================
describe("authenticate", function () {
  test("works", async function () {
    const user = await User.authenticate("user1", "password");

    // Assert the user object
    expect(user).toEqual(
      expect.objectContaining({
        username: "user1",
        firstName: "Test",
        lastName: "User1",
        email: "user1@example.com",
        profilePic:
          "https://images.unsplash.com/photo-1556197908-96ed0fa30b65?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      })
    );
    expect(user.password).toBeDefined();
  });

  test("unauth if wrong password", async function () {
    try {
      await User.authenticate("user1", "wrong");
      fail();
    } catch (err) {
      expect(err instanceof UnauthorizedError).toBeTruthy();
    }
  });

  // ==============register======================
  describe("register", function () {
    const newUser = {
      username: "new",
      firstName: "Test",
      lastName: "Tester",
      "profilePic": null,
      email: "test@test.com"
    };

    test("works", async function () {
      let user = await User.register({
        ...newUser,
        password: "password",
      });
      expect(user).toEqual(newUser);
      const found = await db.query("SELECT * FROM users WHERE username = 'new'");
      expect(found.rows.length).toEqual(1);      
    });
  });
});

// ========================FindAll===================

describe("findAll", function () {
  test("works", async function () {
    const users = await User.findAll();
    expect(users).toEqual([
      {
        username: "user1",
        firstName: "Test",
        lastName: "User1",
        email: "user1@example.com",
        profilePic:
          "https://images.unsplash.com/photo-1556197908-96ed0fa30b65?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
      {
        username: "user2",
        firstName: "Test",
        lastName: "User2",
        email: "user2@example.com",
        profilePic:
          "https://images.unsplash.com/photo-1556197908-96ed0fa30b65?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      },
    ]);
  });
  

  //=============get==========================
  describe("get", function () {
    test("works", async function () {
      let user = await User.get("user1");
      expect(user).toEqual(
        expect.objectContaining({
          username: "user1",
          firstName: "Test",
          lastName: "User1",
          email: "user1@example.com",
          profilePic:
            "https://images.unsplash.com/photo-1556197908-96ed0fa30b65?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        })
      );
    });

    test("not found if no such user", async function () {
      try {
        await User.get("nope");
        fail();
      } catch (err) {
        expect(err instanceof NotFoundError).toBeTruthy();
      }
    });
  });

  //======================update=====================
  
describe("update", function () {
  const updateData = {
    firstName: "New",
    lastName: "New",
    email: "new@email.com",
  };

   test("not found if no such user", async function () {
    try {
      await User.update("nope", {
        firstName: "test",
      });
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request if no data", async function () {
    expect.assertions(1);
    try {
      await User.update("c1", {});
      fail();
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await User.remove("user1");
    const res = await db.query(
        "SELECT * FROM users WHERE username='u1'");
    expect(res.rows.length).toEqual(0);
  });

  test("not found if no such user", async function () {
    try {
      await User.remove("nope");
      fail();
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});
