//================ DEPENDENCIES ==================
const express = require("express");
const router = express.Router();
const db = require("../models");

// for all of these url routes, render the
// handlebar files

router.get("/signup", function(req, res) {
    res.render("adduser");
});

router.get("/login", function(req, res) {
    res.render("login");
});

//Render route for userprofile.handlebars.
//Serves entries from Quizzes table which correspond to the session user's userid.
//Will allow us to serve quiz data upon rendering.
router.get("/profile", function(req, res) {
    db.User.findOne({
        where:{
            id:req.session.user.id
        },
        include:[{
            model:db.Quiz
        }]
    }).then((dbQuizzes)=>{
        console.log(dbQuizzes);
        return res.render("userprofile", dbQuizzes)    
    })
});

router.get("/createquiz", function(req, res) {
    res.render("quizbuildsplash");
});

router.get("/quiz", function(req, res) {
    res.render("takequiz");
});

//Render route for leaderboard.handlebars.
//Serves scores data from the QuizUser table to retrieve the scores related to the quiz and user.
router.get("/leaderboard/:id", function(req, res) {
    db.QuizUser.findAll({
        where:{
            QuizId:req.params.id
        }
    }).then((dbScores)=>{
        console.log(dbLeaderboard);
        const hbsObject={scores:dbScores}
        return res.render("leaderboard", hbsObject)
    })
});

// defaults to index.handlebars if user tries to visit any other route
router.get("*", function(req, res) {
    res.render("index");
});

module.exports = router;