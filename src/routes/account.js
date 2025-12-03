const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const isAuth = require("../middleware/isAuth");
const requireAuth = require("../middleware/requireAuth");

router.get("/:id/edit", requireAuth, accountController.getEdit);
router.get("/:id", isAuth, accountController.getIndex);

module.exports = router;
