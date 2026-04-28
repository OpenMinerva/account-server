const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const requireAuth = require("../middleware/requireAuth");

const oauthController = require("../controllers/oauth");

router.get('/callback', oauthController.callback);

router.get('/interaction/:uid', oauthController.interactionUuid);

router.post('/interaction/:uid/confirm', oauthController.interactionConfirm);

module.exports = router