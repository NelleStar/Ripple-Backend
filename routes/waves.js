"use strict";
// Routes for Waves //
const express = require("express");
const { ensureCorrectUser, ensureLoggedIn } = require ("../middleware/auth");
const Wave = require("../models/waves");

const router = express.Router();

//get waves
router.get("/", async function(req, res, next) {
    try {
        const waves = await Wave.findAll();
        return res.json({ waves });
    } catch(err) {
        return next(err);
    }
});

// get wave
router.get("/:id", async function (req, res, next) {
    const id = req.params.id
    try {
        const wave = await Wave.get(id);
        return res.json({ wave })
    } catch(err) {
        return next(err);
    }
});

// make a wave
router.post("/", ensureLoggedIn, async function(req, res, next){
    try {
        const waveData = {...req.body, username: res.locals.user.username };
        const wave = await Wave.new(waveData, waveData.username);
  
        return res.status(201).json({ wave });
    } catch (err) {
        return next(err)
    }
});

//edit wave
router.patch("/:id", ensureCorrectUser, async function(req, res, next) {
    const id = req.params.id;

    try {
        const { waveString } = req.body;
        const data = { waveString };
        const wave = await Wave.update(id, data);
        return res.json({ wave })
    } catch(err){
        return next(err);
    }
});

//delete a wave
router.delete("/:id", ensureCorrectUser, async function (req, res, next) {
    const id = req.params.id;

    try{
        const deletedWave = await Wave.remove(id);
        if(!deletedWave) {
            return res.status(404).json({error: `No wave found with id ${id}`})
        }
        
        return res.json({ deleted: id })
    } catch(err){
        return next(err);
    }
})

// create a comment for a specific wave
router.post("/:id/comments", ensureLoggedIn, async function(req, res, next) {
    try {
        const waveId = req.params.id;
        const { commentString } = req.body;
        const username = res.locals.user.username
        const newComment = await Wave.addComment(waveId, { username, commentString });

        return res.status(201).json({ newComment })
    } catch(err) {
        return next(err)
    }
})

// update a comment that user made
router.patch("/:waveId/comments/:commentId", ensureCorrectUser, async function(req, res, next) {
    try {
        const waveId = req.params.waveId;
        const commentId = req.params.commentId;
        const { commentString } = req.body;

        const updatedComment = await Wave.updateComment(
            waveId, commentId, { commentString }
        );

        return res.json({ updatedComment });
    } catch (err) {
        return next(err);
    }
})

// delete a comment that a user made
router.delete("/:waveId/comments/:commentId", ensureCorrectUser, async function(req, res, next) {
    const commentId = req.params.commentId;

    try {    
        const deletedComment = await Wave.removeComment(commentId);
        if (!deletedComment) {
            return res.status(404).json({ error: `No comment found with id #${commentId}` });
        }
        return res.json({ deleted: commentId });
    } catch(err) {
        return next(err);
    }
});


module.exports = router;