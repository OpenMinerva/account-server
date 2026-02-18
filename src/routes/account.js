const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const requireAuth = require("../middleware/requireAuth");

const accountController = require("../controllers/account");

router.get("/:account_id", isAuth, accountController.getAccount);
router.get("/:account_id/settings", requireAuth, accountController.getAccountSettings);

module.exports = router