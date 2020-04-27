//================ DEPENDENCIES ==================
const express = require("express");
const router = express.Router();
const db = require("../models");


// for all of these url routes, render the
// handlebar files

router.get("/signup", function (req, res) {
    if (req.session.user) {
        res.redirect("/profile")
    } else {
        res.render("adduser")
    }
});

router.get("/login", function (req, res) {
    if (req.session.user) {
        res.redirect("/profile")
    } else {
        res.render("login")
    }
});

router.get("/about", function (req, res) {
    res.render("aboutus");
});

router.route("/logout")
    .get((req, res) => {
        req.session.destroy(err => {
            res.redirect("/")
        })
    })

router.get("/readsessions", ((req, res) => {
    res.json(req.session);
}))

router.get("/account", function (req, res) {
    if (req.session.user) {
        db.User.findOne({
            raw: true,
            where: {
                id: req.session.user.id
            }
        }).then((dbUser) => {
           res.render("account", dbUser)
        })
    } else {
        res.redirect("/login")
    }
})

//Render route for userprofile.handlebars.
//Serves entries from Quizzes table which correspond to the session user's userid.
//Will allow us to serve quiz data upon rendering.
router.get("/profile", function (req, res) {
    if (req.session.user) {
        db.User.findOne({
            where: {
                id: req.session.user.id
            },
            include: [{
                model: db.Quiz,
            }]
        }).then((dbUserQuizzes) => {
            const hbsObject = { User: dbUserQuizzes.toJSON() };
            console.log("====================")
            console.log(hbsObject)

            console.log(hbsObject);

            return res.render("userprofile", hbsObject)
        })
    } else {
        res.redirect("/login")
    }
});

router.get("/createquiz", function (req, res) {
    // if (req.session.user) {
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
    const hbsObj = { id: req.session.user.id };
    res.render("quizbuild", hbsObj)
    // } else {
    //     res.redirect("/login");
    // }
});

router.get("/quiz/:accesscode", function (req, res) {
    if (req.session.user) {
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
    } else {
        res.redirect("/login");
    }
});

//Render route for leaderboard.handlebars.
//Serves scores data from the QuizUser table to retrieve the scores related to the quiz and user.
router.get("/leaderboard/:QuizId", function (req, res) {
    if (req.session.user) {
        db.Quiz.findOne({

            where: {
                id: req.params.QuizId
            },
            include: [
                {
                    model: db.User
                }
            ]
        }).then((dbScores) => {
            const hbsObject = dbScores.toJSON();
            console.log(hbsObject);

            return res.render("leaderboard", hbsObject)
        })
    } else {
        res.redirect("/login");
    }
});

// defaults to index.handlebars if user tries to visit any other route
router.get("*", function (req, res) {
    if (req.session.user) {
        res.redirect("/profile")
    } else {
        res.render("index");
    }
});

module.exports = router;