"use strict";

const db = require("../db");
const bcrypt = require("bcrypt");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

const { BCRYPT_WORK_FACTOR } = require("../config.js");
const { query } = require("express");

/** Related functions for users. */

class User {
  // authenticate user with username, password. Returns { username, first_name, last_name, email } Throws UnauthorizedError is user not found or wrong password.

  static async authenticate(username, password) {
    // try to find the user first
    const result = await db.query(
      `SELECT username,
                  password,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  profile_pic AS "profilePic"
           FROM users
           WHERE username = $1`,
      [username]
    );

    const user = result.rows[0];

    if (user) {
      console.log(`retrieved user: ${user}, retrieved password: ${user.password}`)

      // compare hashed password to a new hash from password
      const isValid = await bcrypt.compare(password, user.password);
      console.log(`password comparison result: ${isValid}`)

      if (isValid === true) {
        // delete user.password;
        return user;
      }
    }
    throw new UnauthorizedError("Invalid username/password");
  }

  // Register user with data. Returns { username, firstName, lastName, email } Throws BadRequestError on duplicates.
  static async register({
    username,
    password,
    firstName,
    lastName,
    email,
    profilePic,
  }) {
     console.log("Received parameters for register:", {
      username,
      password,
      email,
      firstName,
      lastName,
      profilePic,
    });

    const duplicateCheck = await db.query(
      `SELECT username FROM users WHERE username = $1`,
      [username]
    );

    if (duplicateCheck.rows[0]) {
      throw new BadRequestError(`Duplicate username: ${username}`);
    }

    const hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);

    // Ensure profilePic is provided or set to null if not
    const profilePicValue = profilePic || null;

    const result = await db.query(
      `INSERT INTO users 
      (username, password, email, first_name, last_name, profile_pic)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING 
      username, email, first_name AS "firstName", last_name AS "lastName", profile_pic AS "profilePic"`,
      [username, hashedPassword, email, firstName, lastName, profilePicValue]
    );

    const user = result.rows[0];
    return user;
  }

  // Find all users. Returns [{ username, first_name, last_name, email }, ...]
  static async findAll() {
    console.log("Calling User.findAll()");
    const result = await db.query(
      `SELECT username,
              first_name AS "firstName",
              last_name AS "lastName",
              email,
              profile_pic AS "profilePic"
           FROM users
           ORDER BY username`
    );
    console.log("User.findAll() completed");
    return result.rows;
  }

  // Given a username, return data about user. Returns { username, first_name, last_name, profile_pic }. Throws NotFoundError if user not found.
  static async get(username) {
    const userRes = await db.query(
      `SELECT username,
                  first_name AS "firstName",
                  last_name AS "lastName",
                  email,
                  profile_pic AS "profilePic"
           FROM users
           WHERE username = $1`,
      [username]
    );

    const user = userRes.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
    
    const wavesRes = await db.query(
      `SELECT username, wave_id, wave_string, created_at
      FROM waves
      WHERE username = $1
      ORDER BY created_at DESC`,
      [username],
    );

    user.waves = wavesRes.rows;

    return user;
  }

  /** Update user data with `data`. This is a "partial update" --- it's fine if data doesn't contain all the fields; this only changes provided ones. Data can include:
   * { firstName, lastName, password, email, profile_pic }
   * Returns { username, firstName, lastName, email, profile_pic }
   * Throws NotFoundError if not found.
   */
  static async update(username, data) {
    console.log("Received data:", data);
    if (data.password) {
      data.password = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
    }

    delete data.username;
    console.log("Data after deleting username:", data);

    const { setCols, values } = sqlForPartialUpdate(data, {
      firstName: "first_name",
      lastName: "last_name",
      email: "email",
      profilePic: "profile_pic",
    });
    console.log(`set cols: ${setCols} , values: ${values}`);

    const usernameVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE users 
                      SET ${setCols} 
                      WHERE username = ${usernameVarIdx} 
                      RETURNING username,
                                first_name AS "firstName",
                                last_name AS "lastName",
                                email,
                                profile_pic AS "profilePic"`;

    console.log(`query SQL: ${querySql}`);

    const result = await db.query(querySql, [...values, username]);
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);

    delete user.password;
    return user;
  }

  /** Delete given user from database; returns undefined. */
  static async remove(username) {
    let result = await db.query(
      `DELETE
           FROM users
           WHERE username = $1
           RETURNING username`,
      [username]
    );
    const user = result.rows[0];

    if (!user) throw new NotFoundError(`No user: ${username}`);
  }
}

module.exports = User;
