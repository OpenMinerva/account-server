const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.post("/v1/authenticate", authController.post);
router.post("/v1/createUser", userController.create);

module.exports = router;
