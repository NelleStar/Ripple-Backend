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

    // find all waves
    static async findAll() {
        console.log(`starting findAll()`)
        const result = await db.query(
          `SELECT wave_id AS "waveId",
                    username,
                    wave_string AS "waveString",
                    created_at AS "createdAt"
            FROM waves
            ORDER BY created_at DESC`
        );

        console.log(`result:`, result.rows)
        return result.rows;
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
            [id],
        );

        const wave = waveRes.rows[0];
        console.log(`wave retrieved: ${wave}`);

        if (!wave) throw new NotFoundError(`No wave: ${id}`);

        const commentRes = await db.query(
            `SELECT * FROM comments AS c
            WHERE c.wave_id = $1`,
            [id]
        );

        wave.comments = commentRes.rows.map(comment => ({
            commentId: comment.comment_id,
            commentString: comment.comment_string,
            username: comment.username,
            createdAt: comment.created_at
        }));

        console.log(`comments on this wave:`, wave.comments)
        return wave;
    }

    //edit a single wave based on id
    static async update(id, data) {
        console.log(`edit wave #: ${id}`)
        const{ setCols, values } = sqlForPartialUpdate(
            data, { waveString: "wave_string"}
        );
        
        const querySql = `UPDATE waves
                            SET wave_string=$1
                            WHERE wave_id = $2
                            RETURNING wave_id AS "waveId",
                                    username,
                                    wave_string AS "waveString",
                                    created_at AS "createdAt"`;

        console.log("Generated SQL query:",querySql);                            
        const result = await db.query(querySql, [...values, id]);
        const wave = result.rows[0];
        console.log(`updated wave: ${wave}`)

        if (!wave) throw new NotFoundError(`No wave: ${id}`);

        return wave;
    }

    //delete a single wave based on id
    static async remove(id){
        console.log(`removing a wave: ${id}`)
        let result = await db.query(
            `DELETE
            FROM waves
            WHERE wave_id=$1
            RETURNING wave_id`,
            [id],
        );
        const wave = result.rows[0];

        if(!wave) throw new NotFoundError(`No wave: ${id}`);
    }
}

module.exports = Wave;