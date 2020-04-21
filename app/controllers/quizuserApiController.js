//================ DEPENDENCIES ==================
const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/api/quizuser", function (req, res) {
    db.Staged
        .findAll()
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(400).json(error)
        })
});

router.post("/api/quizuser", function (req, res) {
    db.QuizUser
        .create({
            UserId: req.body.UserId,
            QuizId: req.body.QuizId,
            hasTaken: req.body.hasTaken,
            score: req.body.score
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(400).json(error)
        })
});

router.get("/api/quizuser/:userId/:quizId", function (req, res) {
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

router.put("/api/quizuser/:userId/:quizId", function (req, res) {
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

router.delete("/api/quizuser/:userId/:quizId", function (req, res) {
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