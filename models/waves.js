"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Wave {
  // make a new wave
  static async new(waveData) {
    console.log("Received wave string:", waveData.waveString);
    console.log("Authenticated user:", waveData.username);
    const result = await db.query(
      `INSERT INTO waves
            (username, wave_string, created_at)
            VALUES ($1, $2, $3)
            RETURNING wave_id AS "waveId",
                      username,
                      wave_string AS "waveString",
                      created_at AS createdAt`,
      [waveData.username, waveData.waveString, new Date()]
    );
    const wave = result.rows[0];
    console.log(`New wave made:`, wave);
    return wave;
  }

  // find all waves with comments
  static async findAll() {
    console.log(`starting findAll()`);
    const result = await db.query(
      `SELECT w.wave_id AS "waveId",
                w.username AS "username",
                w.wave_string AS "waveString",
                w.created_at AS "createdAt",
                c.comment_id AS "commentId",
                c.comment_string AS "commentString",
                c.created_at AS "commentCreatedAt",
                c.username AS "commentUsername"
        FROM waves AS w
        LEFT JOIN comments AS c ON w.wave_id = c.wave_id
        ORDER BY w.created_at DESC`
    );

    const wavesById = {};
    for (const row of result.rows) {
      const {
        waveId,
        username,
        waveString,
        createdAt,
        commentId,
        commentString,
        commentCreatedAt,
        commentUsername,
      } = row;
      if (!wavesById[waveId]) {
        wavesById[waveId] = {
          waveId,
          username,
          waveString,
          createdAt,
          comments: [],
        };
      }
      if (commentId) {
        wavesById[waveId].comments.push({
          commentId,
          commentString,
          createdAt: commentCreatedAt,
          username: commentUsername,
        });
      }
    }

    const waves = Object.values(wavesById);
    console.log(`result:`, waves);
    return waves;
  }

  // look at a single wave
  static async get(id) {
    console.log(`get() a single wave with id: ${id}`);
    const waveRes = await db.query(
      `SELECT wave_id AS "waveId",
                    username,
                    wave_string AS "waveString",
                    created_at AS "createdAt"
            FROM waves
            WHERE wave_id = $1`,
      [id]
    );

    const wave = waveRes.rows[0];
    console.log(`wave retrieved: ${wave}`);

    if (!wave) throw new NotFoundError(`No wave: ${id}`);

    const commentRes = await db.query(
      `SELECT * FROM comments AS c
            WHERE c.wave_id = $1`,
      [id]
    );

    wave.comments = commentRes.rows.map((comment) => ({
      commentId: comment.comment_id,
      commentString: comment.comment_string,
      username: comment.username,
      createdAt: comment.created_at,
    }));

    console.log(`comments on this wave:`, wave.comments);
    return wave;
  }

  //edit a single wave based on id
  static async update(id, data) {
    console.log(`edit wave #: ${id}`);
    const { setCols, values } = sqlForPartialUpdate(data, {
      waveString: "wave_string",
    });

    const querySql = `UPDATE waves
                            SET wave_string=$1
                            WHERE wave_id = $2
                            RETURNING wave_id AS "waveId",
                                    username,
                                    wave_string AS "waveString",
                                    created_at AS "createdAt"`;

    console.log("Generated SQL query:", querySql);
    const result = await db.query(querySql, [...values, id]);
    const wave = result.rows[0];
    console.log(`updated wave: ${wave}`);

    if (!wave) throw new NotFoundError(`No wave: ${id}`);

    return wave;
  }

  //delete a single wave based on id
  static async remove(id) {
    console.log(`removing a wave: ${id}`);
    let result = await db.query(
      `DELETE
            FROM waves
            WHERE wave_id=$1
            RETURNING wave_id`,
      [id]
    );
    const wave = result.rows[0];

    if (!wave) throw new NotFoundError(`No wave: ${id}`);
  }
}

module.exports = Wave;