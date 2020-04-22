const express = require("express");
const router = express.Router();
const db = require("../models");
const bcrypt = require("bcrypt");

router.route("/api/users")
    // .get((req, res) => {
    //     db.User.findAll().then(dbUsers => {
    //         res.status(200).json(dbUsers);
    //     })
    // })
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
            
            if (bcrypt.compareSync(req.body.password, dbUser.password)) {
                req.session.user = {
                    username: dbUser.username,
                    id: dbUser.id
                };
                res.send("logged in!")
                // res.redirect("/profile")
            } else {
                res.send("not logged in")
            }
        }).catch(err => {
            console.log(err);
            res.status(500).json(err);

        })
    })

router.route("/logout")
    .get((req, res) => {
        req.session.destroy(err => {
            res.redirect("/")
        })
    })

router.get("/readsessions", ((req, res) => {
    res.json(req.session);
}))

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



// router.route("/api/users/:id")
//     .get((req, res) => {
//         db.User.findOne({
//             where: {
//                 id: req.params.id
//             }
//         }).then(dbUser => {
//             res.status(200).json(dbUser);
//         })
//     }).delete((req, res) => {
//         db.User.destroy({
//             where: {
//                 id: req.params.id
//             }
//         }).then(deletedUser => {
//             res.status(200).json(deletedUser);
//         })
//     }).put((req, res) => {
//         db.User.update({
//             firstName: req.body.firstName,
//             lastName: req.body.lastName,
//             username: req.body.username,
//             password: req.body.password,
//             email: req.body.email
//         }, {
//             where: {
//                 id: req.params.id
//             }
//         }).then(updatedUser => {
//             res.status(200).json(updatedUser);
//         })
//     })

module.exports = router;