const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const requireAuth = require("../middleware/requireAuth");

const userController = require("../controllers/userController");
const authController = require("../controllers/authController");

router.get("/logout", isAuth, authController.remove);

router.post("/v1/authenticate", authController.post);
router.post("/v1/createUser", userController.create);

router.post("/v1/user/username", requireAuth, userController.updateUsername);
router.post("/v1/user/password", requireAuth, userController.updatePassword);
router.post("/v1/user/role", requireAuth, userController.updateRole);
router.post("/v1/user/delete", requireAuth, userController.deleteUser);

module.exports = router;
