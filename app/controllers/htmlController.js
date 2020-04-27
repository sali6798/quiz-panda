//================ DEPENDENCIES ==================
const express = require("express");
const router = express.Router();
const db = require("../models");


// for all of these url routes, render the
// handlebar files, most routes needs authentication
// before accessing

// displays sign up page
router.get("/signup", function (req, res) {
    if (req.session.user) {
        res.redirect("/profile")
    } else {
        res.render("adduser")
    }
});

// display login page
router.get("/login", function (req, res) {
    if (req.session.user) {
        res.redirect("/profile")
    } else {
        res.render("login")
    }
});

// display about page
router.get("/about", function (req, res) {
    res.render("aboutus");
});

// destroys session and redirects to splash page
router.route("/logout")
    .get((req, res) => {
        req.session.destroy(err => {
            res.redirect("/")
        })
    })

// return session information
router.get("/readsessions", ((req, res) => {
    res.json(req.session);
}))

// returns info for the user and brings them to 
// the account page
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

            return res.render("userprofile", hbsObject)
        })
    } else {
        res.redirect("/login")
    }
});

// passes the handlebars the id of the logged in user
// and displays the create quiz page
router.get("/createquiz", function (req, res) {
    if (req.session.user) {
        const hbsObj = { id: req.session.user.id };
        res.render("quizbuild", hbsObj)
    } else {
        res.redirect("/login");
    }
});

// get the quiz information with its questions and
// answers for the given access code
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
                    model: db.User,
                    order: [
                        ['score', 'DESC']
                    ]
                }
            ]

        }).then((dbScores) => {
            const hbsObject = dbScores.toJSON();

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