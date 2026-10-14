const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");

const adminController = require("../controllers/admin");

router.get("/", requireAuth, adminController.getAdmin);

module.exports = router;
