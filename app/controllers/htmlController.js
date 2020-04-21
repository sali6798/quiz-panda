//================ DEPENDENCIES ==================
const express = require("express");
const router = express.Router();
const db = require("../models");

<<<<<<< HEAD
// defaults to index.html if user tries to visit any other route
router.get("*", function (req, res) {
=======
router.get("/signup", function(req, res) {
    res.render("adduser");
});

router.get("/login", function(req, res) {
    res.render("login");
});

router.get("/profile", function(req, res) {
    res.render("userprofile");
});

router.get("/createquiz", function(req, res) {
    res.render("quizbuildsplash");
});

router.get("/quiz", function(req, res) {
    res.render("takequiz");
});

router.get("/leaderboard", function(req, res) {
    res.render("leaderboard");
});

// defaults to index.handlebars if user tries to visit any other route
router.get("*", function(req, res) {
>>>>>>> c5e34259e07863ab8ab608fc0e00dedf375e4720
    res.render("index");
});

module.exports = router;