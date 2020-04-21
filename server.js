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
// changed my port to 8181 because 8080 was running on my comp somehow
const PORT = process.env.PORT || 8081;

// Requiring our models for syncing
const db = require("./app/models");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
// const routename = require("./app/controllers/file");
// app.use(routename);

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
