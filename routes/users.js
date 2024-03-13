"use strict";

//Routes for Users//
const express = require("express");
const User = require("../models/users")
const { ensureCorrectUser } = require("../middleware/auth");



const router = express.Router();

// GET all users
router.get('/', async function(req, res, next){
    try{
        console.log('retrieve users at /');
        const users = await User.findAll();
        console.log('users retrieved')
        return res.json({ users });
    } catch(err) {
        return next(err);
    }
});

router.get("/:username", async function (req, res, next) {
    console.log('retrieve user at /:username');
    try {
        const user = await User.get(req.params.username);
        console.log("user retrieved", user);
        return res.json({ user });
    } catch(err) {
        return next(err);
    }
});

router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
    console.log(`update user at /:username`);
    try {
        const user = await User.update(req.params.username, req.body);
        return res.json({ user })
    } catch(err) {
        return next(err);
    }
});

router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
    console.log(`delete /:username`);
    try {
        await User.remove(req.params.username);
        return res.json({deleted: req.params.username})
    } catch(err) {
        return next(err);
    }
});

module.exports = router;