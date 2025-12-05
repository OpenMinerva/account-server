const express = require("express");
const router = express.Router();
const loginController = require("../controllers/loginController");
const isAuth = require("../middleware/isAuth");

router.get("/", isAuth, loginController.getIndex);

module.exports = router;
