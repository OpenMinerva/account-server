const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const isAuth = require("../middleware/isAuth");
const requireAuth = require("../middleware/requireAuth");

router.get("/", requireAuth, adminController.getIndex);

module.exports = router;
