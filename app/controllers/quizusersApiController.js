//================ DEPENDENCIES ==================
const express = require("express");
const router = express.Router();
const db = require("../models");

// return all the entries in QuizUser joined with Quiz
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

// add a new in QuizUser
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

// find the entry in QuizUser joined with Quiz that matches
// the logged in user's id and the quizId parameter
router.get("/api/quizuser/:quizId", function (req, res) {
    console.log("session id", req.session.id)
    db.QuizUser
        .findOne({
            include: [ db.Quiz ],
            where: {
                UserId: req.session.user.id,
                QuizId: req.params.quizId
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

// updates the entry in QuizUser that matches
// the logged in user's id and the quizId parameter
router.put("/api/quizuser/:quizId", function (req, res) {
    db.QuizUser
        .update({
            hasTaken: req.body.hasTaken,
            score: req.body.score
        }, 
        {
            where: {
                UserId: req.session.user.id,
                QuizId: req.params.quizId
            }
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(400).json(error)
        })
});

// delets the entry in QuizUser that matches
// the logged in user's id and the quizId parameter
router.delete("/api/quizuser/:quizId", function (req, res) {
    db.QuizUser
        .destroy({
            where: {
                UserId: req.session.user.id,
                QuizId: req.params.quizId
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