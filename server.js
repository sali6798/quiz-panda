// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
const express = require("express");
const path = require("path");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);

// Sets up the Express App
// =============================================================
const app = express();
// changed my port to 8181 because 8080 was running on my comp somehow
const PORT = process.env.PORT || 8081;

// Requiring our models for syncing
const db = require("./app/models");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  // secret:process.env.SESSION_SECRET,
  secret:"tacos",
  store: new SequelizeStore({
    db:db.sequelize
  }),
  resave:false,
  saveUninitialized: false,
  cookie: {
    maxAge:7200000
  }
}))

// Static directory
// DONT MESS WITH THIS!
app.use(express.static("app/public"));

// Set Handlebars.
const exphbs = require("express-handlebars");
app.set("views", path.join(__dirname, "./app/views"))
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Routes
// =============================================================
// Data routes
// TODO: put api routes here
const stagedApiRoutes = require("./app/controllers/stagedApiController");
app.use(stagedApiRoutes);

const usersApiRoutes = require("./app/controllers/usersApiController.js");
app.use(usersApiRoutes);

const quizuserApiRoutes = require("./app/controllers/quizusersApiController");
app.use(quizuserApiRoutes);

const quizApiRoutes = require("./app/controllers/quizzesApiController.js");
app.use(quizApiRoutes);

// HTML routes
const htmlRoutes = require("./app/controllers/htmlController");
app.use(htmlRoutes);

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
