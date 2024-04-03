const bcrypt = require("bcrypt");

const db = require("../db.js");
const User = require("../models/users")
const Wave = require("../models/waves")
const { createToken } = require("../helpers/tokens");
const { BCRYPT_WORK_FACTOR } = require("../config");

let testWaveId;

async function commonBeforeAll() {
  await db.query("DELETE FROM users");
  await db.query("DELETE FROM waves");
  await db.query("DELETE FROM comments");

  await db.query(
    `
        INSERT INTO users(username,
                          password,
                          first_name,
                          last_name,
                          email,
                          profile_pic)
        VALUES ('user1',
                $1,
                'Test',
                'User1',
                'user1@example.com',
                'https://images.unsplash.com/photo-1556197908-96ed0fa30b65?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'),
               ('user2',
                $2,
                'Test',
                'User2!',
                'user2@example.com',
                'https://images.unsplash.com/photo-1556197908-96ed0fa30b65?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')
        RETURNING username`,
    [
      await bcrypt.hash("password1", BCRYPT_WORK_FACTOR),
      await bcrypt.hash("password2", BCRYPT_WORK_FACTOR),
    ]
  );

  await db.query(`
        INSERT INTO waves(username, wave_string, created_at)
        VALUES ('user1', 'Great song!', '2024-02-12 08:00:00'),
               ('user2', 'Nice track!', '2024-02-12 08:15:00')`);

  // Retrieve wave_id values from inserted waves
  const result = await db.query(`
        SELECT wave_id FROM waves
  `);

  // Insert comments referencing wave_id values from the previous step
  await db.query(
    `
        INSERT INTO comments(username, wave_id, comment_string, created_at)
        VALUES ('user1', $1, 'I agree!', '2024-02-12 08:05:00'),
               ('user2', $2, 'Love it!', '2024-02-12 08:20:00')`,
    [result.rows[1].wave_id, result.rows[0].wave_id]
  );

   const waveResponse = await db.query(`
    INSERT INTO waves(username, wave_string, created_at)
    VALUES ('user1', 'Test Wave', CURRENT_TIMESTAMP)
    RETURNING wave_id
  `);
   testWaveId = waveResponse.rows[0].wave_id;
}

async function commonBeforeEach() {
  await db.query("BEGIN");
}

async function commonAfterEach() {
  await db.query("ROLLBACK");
}

async function commonAfterAll() {
  await db.end();
}

const u1Token = createToken({ username: "user1" });
const u2Token = createToken({ username: "user2" });

module.exports = {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  u2Token,
  testWaveId,
};
