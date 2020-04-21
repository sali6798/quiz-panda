//================ DEPENDENCIES ==================
const express = require("express");
const router = express.Router();
const db = require("../models");

// defaults to index.html if user tries to visit any other route
router.get("*", function (req, res) {
    res.render("index");
});

module.exports = router;