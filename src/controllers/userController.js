const userService = require("../services/userService");
const logger = require("../libs/logger");
const LOGGER_LABEL = { file: "userController.js" };

const create = async (req, res, next) => {
	try {
		let data = req.body;
		data.role = "user";

		// TODO: Disable signups

		logger.info(`Trying to make an account '${data.username}'.`, {
			...LOGGER_LABEL,
			function: "create",
		});

		if (!passwordConfirmationMatches(data)) return false;

		// TODO: Admin account

		await userService.create({ ...data });

		if (req.accepts("html")) {
			res.redirect("/");
		} else {
			res.json({ ok: true });
		}
	} catch (e) {
		const msg = e instanceof Error ? e.stack : String(e);
		logger.error(`Unknown error trying to create an account.`, {
			...LOGGER_LABEL,
			error: msg,
			function: "create",
		});
		next(e);
	}
};

function passwordConfirmationMatches(data) {
	if (!data.password) {
		logger.warn("No password supplied when trying to create a user.", { ...LOGGER_LABEL, function: "passwordConfirmationMatches" });
		return false;
	}
	if (!data.passwordConfirm) {
		logger.warn("No password confirmation supplied when trying to create a user.", { ...LOGGER_LABEL, function: "passwordConfirmationMatches" });
		return false;
	}

	if (data.password === data.passwordConfirm) {
		return true;
	}

	if (data.password !== data.passwordConfirm) {
		logger.info("Tried to make an account, but password did not match.", { ...LOGGER_LABEL, function: "passwordConfirmationMatches" });
		return false;
	}

	logger.error("Unknown error when checking password confirmation.", { ...LOGGER_LABEL, function: "passwordConfirmationMatches" });
	return false;
}

module.exports = { create };
