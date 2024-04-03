"use strict";

const request = require("supertest");
const app = require("../app");
const db = require("../db");
const Wave = require("../models/waves")

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  testWaveId,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);

describe("GET /waves", function () {
  test("works", async function () {
    const response = await request(app).get("/waves");
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ waves: expect.any(Array) })
    );
  });
});

describe("GET /waves/:id", function () {
  test("works", async function () {
    const response = await request(app).get(`/waves/${testWaveId}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ wave: expect.any(Object) })
    );
  });

  test("not found if wave doesn't exist", async function () {
    const response = await request(app).get("/waves/9999");
    expect(response.statusCode).toBe(404);
  });
});

describe("POST /waves", function () {
  test("works", async function () {
    const response = await request(app)
      .post("/waves")
      .send({
        waveString: "Test Wave",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({ wave: expect.any(Object) })
    );
  });
});

describe("PATCH /waves/:id", function () {
  test("works", async function () {
    const response = await request(app)
      .patch("/waves/1")
      .send({
        waveString: "Updated Wave",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ wave: expect.any(Object) })
    );
  });

  test("not found if wave doesn't exist", async function () {
    const response = await request(app)
      .patch("/waves/9999")
      .send({
        waveString: "Updated Wave",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(response.statusCode).toBe(404);
  });
});

describe("DELETE /waves/:id", function () {
  test("works", async function () {
    const response = await request(app)
      .delete("/waves/" + expect.stringMatching(/^[1-9][0-9]*$/)) 
      .set("authorization", `Bearer ${u1Token}`);

    expect(response.statusCode).toBe(200);
  });

  test("not found if wave doesn't exist", async function () {
    const response = await request(app)
      .delete("/waves/9999")
      .set("authorization", `Bearer ${u1Token}`);
    expect(response.statusCode).toBe(404);
  });
});

describe("POST /waves/:id/comments", function () {
  test("works", async function () {
    const response = await request(app)
      .post("/waves/1/comments")
      .send({
        commentString: "Test Comment",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual(
      expect.objectContaining({ newComment: expect.any(Object) })
    );
  });
});

describe("PATCH /waves/:waveId/comments/:commentId", function () {
  test("works", async function () {
    const response = await request(app)
      .patch("/waves/1/comments/1")
      .send({
        commentString: "Updated Comment",
      })
      .set("authorization", `Bearer ${u1Token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ updatedComment: expect.any(Object) })
    );
  });
});


describe("DELETE /waves/:waveId/comments/:commentId", function () {
  test("works", async function () {
    const response = await request(app)
      .delete("/waves/1/comments/1")
      .set("authorization", `Bearer ${u1Token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual(
      expect.objectContaining({ deleted: expect.any(String) })
    );
  });
});
