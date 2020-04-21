const express = require("express");
const router = express.Router();
const db = require("../models");

router.route("/api/users")
    .get((req, res) => {
        db.User.findAll().then(dbUsers => {
            res.status(200).json(dbUsers);
        })
    })
    .post((req, res) => {
        db.User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        }).then(dbNewUser => {
            res.status(200).json(dbNewUser);
        })
    })

router.route("/api/users/:id")
    .get((req, res) => {
        db.User.findOne({
            where: {
                id: req.params.id
            }
        }).then(dbUser => {
            res.status(200).json(dbUser);
        })
    }).delete((req, res) => {
        db.User.destroy({
            where: {
                id: req.params.id
            }
        }).then(deletedUser => {
            res.status(200).json(deletedUser);
        })
    }).put((req, res) => {
        db.User.update({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        }, {
            where: {
                id: req.params.id
            }
        }).then(updatedUser => {
            res.status(200).json(updatedUser);
        })
    })

module.exports=router;