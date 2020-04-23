//================ DEPENDENCIES ==================
const express = require("express");
const router = express.Router();
const db = require("../models");

//====== GET/POST requests for /api/staged ==========
// returns all entries in staged
router.get("/api/staged", function (req, res) {
    db.Staged
        .findAll()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(400).json(error)
        })
});

// creates a new entry in the staged table
router.post("/api/staged", function (req, res) {
    db.Staged
        .create({
            storedQuiz: req.body.storedQuiz,
            UserId: req.session.user.id
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(400).json(error)
        })
});

//======== GET/PUT/DELETE requests for /api/staged/:id =================
// returns the entry in staged that matches the id parameter
router.get("/api/staged/:id", function (req, res) {
    db.Staged
        .findOne({
            where: {
                id: req.params.id
            }
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(400).json(error)
        })
});

// updates the storedQuiz property for the given id
router.put("/api/staged/:id", function (req, res) {
    db.Staged
        .update({
            storedQuiz: req.body.storedQuiz
        }, {
            where: {
                id: req.params.id
            }
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(400).json(error)
        })
});

// deletes the entry in staged that matches the id
router.delete("/api/staged/:id", function (req, res) {
    db.Staged
        .destroy({
            where: {
                id: req.params.id
            }
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(400).json(error)
        })
});

module.exports = router;