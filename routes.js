const express = require("express");
const Router = express.Router();

Router.get("/", (req, res) => {
  res.send("This is running");
});

module.exports = Router;