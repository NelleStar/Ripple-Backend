"use strict";
// Routes for Waves //
const express = require("express");
const { ensureCorrectUser, ensureLoggedIn } = require ("../middleware/auth");
const Wave = require("../models/waves");

const router = express.Router();

//get waves
router.get("/", async function(req, res, next) {
    try {
        console.log('retreive waves');
        const waves = await Wave.findAll();
        console.log('waves retrieved');
        return res.json({ waves });
    } catch(err) {
        return next(err);
    }
});

// get wave
router.get("/:id", async function (req, res, next) {
    const id = req.params.id
    console.log(`single wave #`, id);
    try {
        const wave = await Wave.get(id);
        console.log(`retrieved wave:`, wave)
        return res.json({ wave })
    } catch(err) {
        return next(err);
    }
});

//make a wave
router.post("/", ensureCorrectUser, async function(req, res, next){
    try {
        console.log("Post a new wave by user", res.locals.user.username); 
        const waveData = {...req.body, username: res.locals.user.username };
        console.log(`waveData:`, waveData)
        const wave = await Wave.new(waveData, waveData.username);
        console.log("Make a wave", wave);
        return res.status(201).json({ wave });
    } catch (err) {
        return next(err)
    }
});


//edit wave
router.patch("/:id", ensureCorrectUser, async function(req, res, next) {
    const id = req.params.id;
    console.log(`editing wave #${id}`);
    try {
        const { waveString } = req.body;
        const data = { waveString };
        console.log('waveString/data:', data);
        const wave = await Wave.update(id, data);
        return res.json({ wave })
    } catch(err){
        return next(err);
    }
});

//delete a wave
router.delete("/:id", ensureCorrectUser, async function (req, res, next) {
    const id = req.params.id;
    console.log(`delete wave #${id}`);
    try{
        await Wave.remove(id);
        return res.json({ deleted: id })
    } catch(err){
        return next(err);
    }
})

module.exports = router;