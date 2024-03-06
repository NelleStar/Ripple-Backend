"use strict";

//routes for users
const jsonschema = require("jsonschema");
const express = require("express");
const User = require("../models/users")

// const db = require("../db");
const { ensureCorrectUser } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const { createToken } = require("../helpers/tokens");

const router = express.Router();

// GET all users
router.get('/', async function(req, res, next){
    try{
        // console.log('retrieve users at /');
        const users = await User.findAll();
        // console.log('users retrieved')
        return res.json({ users });
    } catch(err) {
        return next(err);
    }
});

router.get("/:username", ensureCorrectUser, async function (req, res, next) {
    console.log('retrieve user at /:username');
    try {
        const user = await User.get(req.params.username);
        console.log("user retrieved");
        return res.json({ user });
    } catch(err) {
        return next(err);
    }
});

module.exports = router;