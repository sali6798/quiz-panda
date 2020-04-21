//================ DEPENDENCIES ==================
const express = require("express");
const router = express.Router();
const db = require("../models");

router.get("/api/quizuser", function (req, res) {
    db.QuizUser
        .findAll({
            include: [ db.Quiz ]
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            console.log(error)
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

router.get("/api/quizuser/:user/:quiz", function (req, res) {
    db.QuizUser
        .findOne({
            include: [ db.Quiz ],
            where: {
                UserId: req.params.user,
                QuizId: req.params.quiz
            }
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            console.log(error)
            res.status(400).json(error)
        })
});

router.put("/api/quizuser/:user/:quiz", function (req, res) {
    db.QuizUser
        .update({
            hasTaken: req.body.hasTaken,
            score: req.body.score
        }, 
        {
            where: {
                UserId: req.params.user,
                QuizId: req.params.quiz
            }
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(400).json(error)
        })
});

router.delete("/api/quizuser/:user/:quiz", function (req, res) {
    db.QuizUser
        .destroy({
            where: {
                UserId: req.params.user,
                QuizId: req.params.quiz
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