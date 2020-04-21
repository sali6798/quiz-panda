//================ DEPENDENCIES ==================
const express = require("express");
const router = express.Router();
const db = require("../models");

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
    res.render("index");
});

module.exports = router;