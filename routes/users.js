"use strict";

//Routes for Users//
const express = require("express");
const User = require("../models/users")
const { ensureCorrectUser } = require("../middleware/auth");



const router = express.Router();

// GET all users
router.get('/', async function(req, res, next){
    try{
        const users = await User.findAll();
        return res.json({ users });
    } catch(err) {
        return next(err);
    }
});

router.get("/:username", async function (req, res, next) {
    try {
        const user = await User.get(req.params.username);
        return res.json({ user });
    } catch(err) {
        return next(err);
    }
});

router.patch("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        const user = await User.update(req.params.username, req.body);
        return res.status(200).json({ user });
    } catch(err) {
        if (err.message === "User not found") {
          return res.status(404).json({ error: "User not found" });
        } else {
          return next(err); 
        }
    }
});

router.delete("/:username", ensureCorrectUser, async function (req, res, next) {
    try {
        await User.remove(req.params.username);
        return res.json({deleted: req.params.username})
    } catch(err) {
        return next(err);
    }
});

module.exports = router;