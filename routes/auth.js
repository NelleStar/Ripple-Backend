"use strict";

/** Routes for authentication. */

const jsonschema = require("jsonschema");
const User = require("../models/users");
const express = require("express");
const router = express.Router();
const { createToken } = require("../helpers/tokens");
const { BadRequestError } = require("../expressError");

//POST /auth/token:  { username, password } => { token } Returns JWT token which can be used to authenticate further requests. Authorization required: none

router.post("/token", async function (req, res, next) {
  try {
    const { username, password } = req.body
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

// POST /auth/register: { user } => { token } user must include { username, password, firstName, lastName, email } Returns JWT token which can be used to authenticate further requests. Authorization required: none

router.post("/register", async function (req, res, next) {
  try {
    const newUser = await User.register({ ...req.body });
    const token = createToken(newUser);
    return res.status(201).json({ token });
  } catch (err) {
    return next(err);
  }
});

// POST /auth/login: { username, password } => { token } Returns JWT token for authenticated user. Authorization required: none
router.post("/login", async function (req, res, next) {
    console.log("login being called")
  try {
    const { username, password } = req.body;
    const user = await User.authenticate(username, password);
    const token = createToken(user);
    return res.json({ token });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
