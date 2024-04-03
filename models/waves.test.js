"use strict";
const request = require("supertest");

const db = require("../db");
const Wave = require("./waves");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");


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


describe("Wave", function () {
  describe("new", function () {
    test("works: creates a new wave", async function () {
      const waveData = {
        username: "user1",
        waveString: "Test wave content",
      };

      const wave = await Wave.new(waveData);

      expect(wave.username).toBe(waveData.username);
      expect(wave.waveString).toBe(waveData.waveString);
    });
  });

  describe("findAll", function () {
    test("works: returns all waves with comments", async function () {
      const waves = await Wave.findAll();

      expect(waves.length).toBeGreaterThan(0);

      waves.forEach(wave => {
        expect(wave).toHaveProperty("waveId");
        expect(wave).toHaveProperty("username");
        expect(wave).toHaveProperty("waveString");
        expect(wave).toHaveProperty("createdAt");
        expect(wave).toHaveProperty("comments");
        expect(Array.isArray(wave.comments)).toBe(true);
      });
    });
  });

  describe("update", function () {
        test("throws NotFoundError: wave not found", async function () {
      const updatedWaveData = {
        waveString: "Updated wave content",
      };

      try {
        await Wave.update(1, updatedWaveData);
        fail("update method should have thrown NotFoundError");
      } catch (err) {
        expect(err instanceof NotFoundError).toBe(true);
      }
    });
  });
});


  describe("get", function () {
    test("works: retrieves a single wave by id", async function () {
      const waveData = {
        username: "user1",
        waveString: "Test wave content",
      };

      const newWave = await Wave.new(waveData);
      const retrievedWave = await Wave.get(newWave.waveId);

      expect(retrievedWave.username).toBe(waveData.username);
      expect(retrievedWave.waveString).toBe(waveData.waveString);
    });

    test("throws NotFoundError: wave not found", async function () {
      try {
        await Wave.get(999999); // Provide a non-existent wave id
        fail("get method should have thrown NotFoundError");
      } catch (err) {
        expect(err instanceof NotFoundError).toBe(true);
      }
    });
  });

  describe("remove", function () {
    test("works: removes a single wave by id", async function () {
      const waveData = {
        username: "user1",
        waveString: "Test wave content",
      };
      const newWave = await Wave.new(waveData);

      await Wave.remove(newWave.waveId);

      try {
        await Wave.get(newWave.waveId);
        fail("get method should have thrown NotFoundError");
      } catch (err) {
        expect(err instanceof NotFoundError).toBe(true);
      }
    });

    test("throws NotFoundError: wave not found", async function () {
      try {
        await Wave.remove(999999); 
        fail("remove method should have thrown NotFoundError");
      } catch (err) {
        expect(err instanceof NotFoundError).toBe(true);
      }
    });
  });

  describe("addComment", function () {
    test("works: adds a comment to a wave", async function () {
      // Create a test wave
      const waveData = {
        username: "user1",
        waveString: "Test wave content",
      };
      
      const newWave = await Wave.new(waveData);
      const commentData = {
        username: "user2",
        commentString: "Test comment",
      };
      const newComment = await Wave.addComment(newWave.waveId, commentData);
      const updatedWave = await Wave.get(newWave.waveId);

      expect(updatedWave.comments.length).toBe(1);
      expect(updatedWave.comments[0].commentString).toBe(
        commentData.commentString
      );
    });

    test("throws NotFoundError: wave not found", async function () {
      const commentData = {
        username: "user2",
        commentString: "Test comment",
      };

      try {
        await Wave.addComment(999999, commentData); 
        fail("addComment method should have thrown NotFoundError");
      } catch (err) {
        expect(err instanceof NotFoundError).toBe(true);
      }
    });
  });


