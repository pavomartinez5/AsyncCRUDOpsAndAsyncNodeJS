const express = require("express");
const router = express.Router();

//Import registerController
const registerController = require("../controllers/registerController");

//Define our route
router.post("/", registerController.handleNewUser);

module.exports = router;
