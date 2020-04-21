//================ DEPENDENCIES ==================
const express = require("express");
const router = express.Router();
const db = require("../models");

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

router.post("/api/staged", function (req, res) {
    db.Staged
        .create({
            storedQuiz: req.body.storedQuiz,
            UserId: req.body.UserId
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(400).json(error)
        })
});

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