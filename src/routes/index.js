const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const requireAuth = require("../middleware/requireAuth");

const indexController = require("../controllers/index");

router.get("/", isAuth, indexController.getIndex);
router.get("/login", isAuth, indexController.getLogin);
router.get("/signup", isAuth, indexController.getSignup);
router.get("/logout", isAuth, indexController.getLogout);
router.get("/public_key", indexController.getPublicKey);

module.exports = router