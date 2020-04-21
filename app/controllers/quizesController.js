const express = require("express");
const router = express.Router();
const db = require("../models");


router.route("/api/quiz/")
    .post((req, res) => {

        db.Quiz.create({
            title: req.body.title,
            canRetake: req.body.canRetake,
            creatorId: req.body.creatorId

        }).then(newQuizData => {
            for (let i = 0; i < req.body.questions.length; i++) {
                const newQuestion = req.body.questions[i];
                db.Question.create({
                    title: newQuestion.title,
                    QuizId: newQuizData.id

                }).then(newQuestionData => {
                    for (let i = 0; i < newQuestion.answers.length; i++) {
                        const newAnswer = newQuestion.answers[i];
                        db.Answer.create({
                            answer: newAnswer.answer,
                            correctAnswer: newAnswer.correctAnswer,
                            QuestionId: newQuestionData.id
                        }).then((data) => {
                            res.status(200);
                        })

                    }
                })
            }
        }).then(data => {
            res.json(data);
        }).catch(err => {
            res.status(500)
        })
    })


router.route("/api/quiz/:id")
    .get((req, res) => {

        db.Quiz.findOne({
            where: {
                id: req.params.id
            },

            include: [
                {
                    model: db.Question,

                    include: [
                        {
                            model: db.Answer
                        }
                    ]
                }
            ]
        }).then(quiz => {
            res.json(quiz);
        }).catch(err => {
            res.status(500);
        })

    }).delete((req, res) => {
        db.Quiz.update({
            isDeleted: true
        }, {
            where: {
                id: req.params.id
            }
        }).then(quiz => {
            db.Question.destroy({
                where: {
                    QuizId: req.params.id
                }
            })
        }).then(data => {
            res.status(200).end;
        }).catch(err => {
            res.status(500);
        })
    })

module.exports = router;