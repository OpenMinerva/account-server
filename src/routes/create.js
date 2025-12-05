const express = require("express");
const router = express.Router();
const indexController = require("../controllers/loginController");
const isAuth = require("../middleware/isAuth");

router.get("/", isAuth, indexController.getSignup);

module.exports = router;
