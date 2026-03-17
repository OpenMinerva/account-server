const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const requireAuth = require("../middleware/requireAuth");

const apiController = require('../controllers/api')

// Accounts
router.get("/v1/account", isAuth, apiController.getAccount);
router.post("/v1/account", isAuth, apiController.createAccount);
router.patch("/v1/account", isAuth, apiController.patchAccount);
router.delete("/v1/account", isAuth, apiController.deleteAccount);

module.exports = router