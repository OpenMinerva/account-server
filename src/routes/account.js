const express = require("express");
const router = express.Router();
const accountController = require("../controllers/accountController");
const isAuth = require("../middleware/isAuth");

router.get("/:id/edit", isAuth, accountController.getEdit);
router.get("/:id", isAuth, accountController.getIndex);

module.exports = router;
