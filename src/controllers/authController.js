/*global process*/

const authService = require("../services/authService");
const userService = require("../services/userService");
const logger = require("../libs/logger");
const LOGGER_LABEL = { file: "authController.js" };
const jwt = require("jsonwebtoken");
const { getSecret } = require("../libs/jwtSecret");

async function get(req, res) {
	res.render("login", { settings: global.siteSettings, user: req.user });
}

async function post(req, res) {
	const { username, password } = req.body;

	if (!username || !password) {
		if (req.accepts("html")) {
			res.status(401).redirect("/?error='Invalid Credentials'");
			return;
		} else {
			res.status(401).json({ error: "Invalid Credentials" });
			return;
		}
	}

	const desiredUser = await userService.get({ username, includePassword: true }, req.user);

	if (!desiredUser) {
		logger.info(`No '${username}' user found.`, { ...LOGGER_LABEL, function: "post" });

		if (req.accepts("html")) {
			res.status(401).redirect("/?error='Invalid Credentials'");
		} else {
			res.status(401).json({ error: "Invalid Credentials" });
		}
		return;
	}

	const passwordCorrect = await authService.checkUserPassword(password, desiredUser.password);

	if (!passwordCorrect) {
		logger.info(`Password incorrect for '${username}'.`, { ...LOGGER_LABEL, function: "post" });

		if (req.accepts("html")) {
			res.status(401).redirect("/?error='Invalid Credentials'");
		} else {
			res.status(401).json({ error: "Invalid Credentials" });
		}
		return;
	}

	const token = jwt.sign({ id: desiredUser.id, username: desiredUser.username, role: desiredUser.role }, getSecret(), { expiresIn: "1d" });
	const COOKIE_SETTINGS = {
		httpOnly: false,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 24 * 60 * 60 * 1000,
	};

	if (req.accepts("html")) {
		res.cookie("token", token, COOKIE_SETTINGS).redirect("/");
	} else {
		res.cookie("token", token, COOKIE_SETTINGS).json({ ok: true });
	}
}

async function remove(req, res) {
	const COOKIE_SETTINGS = {
		httpOnly: false,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 0,
	};

	if (!req.requestingUser) {
		logger.info(`Tried to log out an unauthenticated user.`, { ...LOGGER_LABEL, function: "remove" });

		if (req.accepts("html")) {
			res.status(401).redirect("/");
		} else {
			res.status(401).json({ ok: false });
		}

		return;
	}

	const token = jwt.sign({ id: req.requestingUser.id }, getSecret(), { expiresIn: "1" });

	if (req.accepts("html")) {
		res.cookie("token", token, COOKIE_SETTINGS).redirect("/");
	} else {
		res.cookie("token", token, COOKIE_SETTINGS).json({ ok: true });
	}

	logger.info(`Signed user ${req.requestingUser.id} out`, { ...LOGGER_LABEL, function: "remove" });
}

module.exports = { get, post, remove, jwtToken: getSecret };
