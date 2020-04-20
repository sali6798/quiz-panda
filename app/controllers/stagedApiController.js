//================ DEPENDENCIES ==================
const express = require("express");
const router = express.Router();
const db = require("../models");

router.post("/", function (req, res) {
    db.Staged
        .create({
            storedQuiz: req.body.storedQuiz,
            UserId: req.body.UserId
        })
        .then(data => {
            res.status(200).json(data)
        })
        .catch(error => {
            res.status(400).json(error)
        })
});

router.get("/:id", function (req, res) {
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

router.put("/:id", function (req, res) {
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

router.delete("/:id", function (req, res) {
    res.render("index");
});



module.exports = router;