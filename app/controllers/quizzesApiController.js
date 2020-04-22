const express = require("express");
const router = express.Router();
const db = require("../models");

// GET and POST requests for /api/quiz
router.route("/api/quiz")
    // gets and returns json of all quiz entries
    .get((req, res) => {
        db.Quiz.findAll().then(quizzes => {
            res.status(200).json(quizzes)
        }).catch(err => {
            res.status(400).json(err)
        })
    })
    // creates a new quiz, questions and answers
    .post((req, res) => {
        db.Quiz.create({
            title: req.body.title,
            canRetake: req.body.canRetake,
            creatorId: req.session.user.id

        }).then(newQuizData => {
            // iterates through questions array and creates a
            // new entry in the database for each question linked
            // to the new quiz id created above
            for (let i = 0; i < req.body.questions.length; i++) {
                const newQuestion = req.body.questions[i];
                db.Question.create({
                    title: newQuestion.title,
                    QuizId: newQuizData.id

                }).then(newQuestionData => {
                    // iterates through answers array for each question and creates a
                    // new entry in the database for each answer linked
                    // to the new question id created above
                    for (let i = 0; i < newQuestion.answers.length; i++) {
                        const newAnswer = newQuestion.answers[i];
                        db.Answer.create({
                            answer: newAnswer.answer,
                            correctAnswer: newAnswer.correctAnswer,
                            QuestionId: newQuestionData.id
                        }).then((data) => {
                            res.status(200).end();
                        })

                    }
                })
            }
        }).catch(err => {
            console.log(err)
            res.status(500).end();
        })
    })

// GET and DELETE routes for /api/quiz/:id
router.route("/api/quiz/:id")
    // returns the quiz with its questions and answers
    // that matches the id given in the parameter
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
            res.status(500).json(err);
        })
    // sets the isDeleted property to true for the quiz that matches the id  
    // parameter and then deletes the questions and answers for that quiz
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
            res.status(200).end();
        }).catch(err => {
            res.status(500).json(err);
        })
    })

module.exports = router;