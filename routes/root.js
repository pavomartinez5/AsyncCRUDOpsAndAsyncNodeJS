//Import express
const express = require("express");

//Define a router with express
const router = express.Router();

//Import common core modules
const path = require("path");

//Define Routes
router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

module.exports = router;
