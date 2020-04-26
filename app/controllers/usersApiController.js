const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcrypt");

router.route("/api/users")
    .post((req, res) => {
        db.User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password,
            email: req.body.email
        }).then(dbNewUser => {
            // res.status(200).json(dbNewUser);
            req.session.user = {
                username: dbNewUser.username,
                id: dbNewUser.id
            };
            res.send("logged in!")
            // res.redirect('/')
        }).catch(err => {
            console.log(err);
            res.status(500).json(err);

        })
    })

router.route("/login")
    .post((req, res) => {
        db.User.findOne({
            where: {
                username: req.body.username
            }
        }).then(dbUser => {
            console.log(dbUser);
            if (dbUser !== null) {
                if (bcrypt.compareSync(req.body.password, dbUser.password)) {
                    req.session.user = {
                        username: dbUser.username,
                        id: dbUser.id
                    };
                    res.status(200).send("OK");
                } else {
                    res.status(200).send("not logged in");
                }
            }
            else {
                res.status(200).send("user not found");
            }

        }).catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
    })

router.route("/api/users/:username")
    .get((req, res) => {
        db.User.findOne({
            where: {
                username: req.params.username
            }
        }).then(dbUser => {
            res.status(200).json(dbUser);
        }).catch(err => {
            res.status(404).json(err)
        })
    })
    .put((req, res) => {
        let updatedPassword;

        if (req.body.password.length === 1) {
            updatedPassword = req.body.password[0]
        }
        else {
            updatedPassword = bcrypt.hashSync(req.body.password[0], bcrypt.genSaltSync(10), null)
        }

        db.User.update({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: updatedPassword,
            email: req.body.email,

        }, {
            where: {
                username: req.params.username
            }
        }).then(dbUpdatedUser => {
            res.status(200).json(dbUpdatedUser);
        }).catch(err => {
            res.status(404).json(err)
        })
    })

// needed to send emails
router.route("/api/users/id/:id")
    .get((req, res) => {
        db.User.findOne({
            where: {
                id: req.params.id
            }
        }).then(dbUser => {
            res.status(200).json(dbUser);
        })
    })

module.exports = router;