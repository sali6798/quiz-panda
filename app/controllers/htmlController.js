//================ DEPENDENCIES ==================
const express = require("express");
const router = express.Router();
const db = require("../models");

// for all of these url routes, render the
// handlebar files

router.get("/signup", function (req, res) {
    res.render("adduser");
});

router.get("/login", function (req, res) {
    res.render("login");
});

//Render route for userprofile.handlebars.
//Serves entries from Quizzes table which correspond to the session user's userid.
//Will allow us to serve quiz data upon rendering.
router.get("/profile", function (req, res) {
    db.User.findOne({
        where: {
            id: req.session.user.id
        },
        include: [{
            model: db.Quiz
        }]
    }).then((dbQuizzes) => {
        console.log(dbQuizzes);
        return res.render("userprofile", dbQuizzes)
    })
});

router.get("/createquiz", function (req, res) {
    // db.Staged.findAll({
    //     where: {
    //         UserId: req.session.user.id
    //     }
    // }).then((dbStagedQuizzes) => {
    //     const hbsStagedObj = { quiz: dbStagedQuizzes };
    //     console.log("________________");
    //     console.log(hbsStagedObj);

    //     return res.render("quizbuild", hbsStagedObj);
    // })
    res.render("quizbuild")
});

router.get("/quiz/:accesscode", function (req, res) {
    db.Quiz.findOne({
        where: {
            accessCode: req.params.accesscode
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
        const QuizJson = quiz.toJSON();
        console.log(QuizJson);
        console.log("---------------");

        res.render("takequiz", QuizJson);
    }).catch(err => {
        res.status(500).json(err);
    })

});

//Render route for leaderboard.handlebars.
//Serves scores data from the QuizUser table to retrieve the scores related to the quiz and user.
router.get("/leaderboard/:QuizId", function (req, res) {
    db.Quiz.findOne({
        where:{
            id:req.params.QuizId
        },
        include:[
            {
                model:db.User
            }
        ]
    // })
    
    // db.QuizUser.findAll({
    //     where: {
    //         QuizId: req.params.QuizId
    //     },

    //     include: [
    //         {
    //             model: db.Quiz,
    //             include: [
    //                 { model:db.User }
    //             ]
    //         }
    //     ]
    }).then((dbScores) => {
        console.log("_________________");
        console.log("DB SCORES: ", dbScores);
        // const dbScoresJSON = dbScores.map(score => {
        //     return score.toJSON();
        // })
        // const hbsObject = { scores: dbScoresJSON, title: dbScoresJSON[0].Quiz.title };
        const hbsObject = dbScores.toJSON();
        console.log("__________________");

        console.log("hbsObject", hbsObject);

        return res.render("leaderboard", hbsObject)
    })
});

// defaults to index.handlebars if user tries to visit any other route
router.get("*", function (req, res) {
    res.render("index");
});

module.exports = router;