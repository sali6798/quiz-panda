// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
const express = require("express");
const path = require("path");

// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 8080;

// Requiring our models for syncing
const db = require("./app/models");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static directory
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

const userRoutes = require("./app/controllers/usersApiController.js");
app.use(userRoutes);

const quizuserApiRoutes = require("./app/controllers/quizuserApiController");
app.use(quizuserApiRoutes);

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
