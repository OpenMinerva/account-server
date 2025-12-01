const express = require("express");
const router = express.Router();
const indexController = require("../controllers/indexController");
const isAuth = require("../middleware/isAuth");

router.get("/", isAuth, indexController.getIndex);

module.exports = router;
