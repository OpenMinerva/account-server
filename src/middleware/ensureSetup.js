const logger = require("../libs/logger");
const LOGGER_LABEL = { file: "ensureSetup.js" };
const userService = require("../services/userService");

let isSetup;

async function checkSetup() {
	if (isSetup !== undefined) return isSetup;

	isSetup = (await userService.get({ role: "admin" }).length) > 0;
	return isSetup;
}

async function ensureSetup(req, res, next) {
	if (req.path === "/signup") {
		return next();
	}

	if (!(await checkSetup())) {
		logger.info("Server is not set up, redirecting to the setup page.", { ...LOGGER_LABEL, function: "ensureSetup" });
		return res.redirect("/signup");
	}

	next();
}

function changeSetupState(state = true) {
	const newValue = Boolean(state);
	logger.info(`Changing setup state to ${newValue}`, { ...LOGGER_LABEL, function: "ensureSetup" });
	isSetup = newValue;
}

module.exports = { checkSetup, ensureSetup, changeSetupState };
