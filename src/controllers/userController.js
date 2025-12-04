const userService = require("../services/userService");
const logger = require("../libs/logger");
const LOGGER_LABEL = { file: "userController.js" };
const ensureSetup = require("../middleware/ensureSetup");

const create = async (req, res, next) => {
	try {
		let data = req.body;

		data.role = "user";

		if (!(await ensureSetup.checkSetup())) {
			// First account is an admin.
			data.role = "admin";
		}

		// TODO: Disable signups

		logger.info(`Trying to make an account '${data.username}'.`, {
			...LOGGER_LABEL,
			function: "create",
		});

		if (!passwordConfirmationMatches(data)) return false;

		await userService.create({ ...data });
		ensureSetup.changeSetupState(true);

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

const updateUsername = async (req, res, next) => {
	// Validate request
	if (req.requestingUser.id != req.body.id && req.requestingUser.role != "admin") {
		if (req.accepts("html")) {
			return res.redirect(`/account/${req.body.id}`);
		} else {
			return res.json({ ok: false });
		}
	}

	logger.info(`Updating username for '${req.body.id}'.`, {
		...LOGGER_LABEL,
		function: "create",
	});
	await userService.updateUsername(req.body.id, req.body.Username);

	if (req.accepts("html")) {
		return res.sendStatus(204);
	} else {
		return res.json({ ok: true });
	}
};

const updatePassword = async (req, res, next) => {
	// Validate request
	if (req.requestingUser.id != req.body.id) {
		if (req.accepts("html")) {
			return res.redirect(`/account/${req.body.id}`);
		} else {
			return res.json({ ok: false });
		}
	}

	logger.info(`Updating password for '${req.body.id}'.`, {
		...LOGGER_LABEL,
		function: "create",
	});

	if (!passwordConfirmationMatches({ password: req.body.password, passwordConfirm: req.body.passwordConfirm })) {
		if (req.accepts("html")) {
			return res.redirect(`/account/${req.body.id}/edit?error='Passwords do not match'`);
		} else {
			return res.json({ ok: false });
		}
	}

	await userService.updatePassword(req.body.id, req.body.password);

	if (req.accepts("html")) {
		return res.redirect(`/account/${req.body.id}/edit`);
	} else {
		return res.json({ ok: true });
	}
};

function passwordConfirmationMatches(data) {
	if (!data.password) {
		return false;
	}
	if (!data.passwordConfirm) {
		return false;
	}

	if (data.password === data.passwordConfirm) {
		return true;
	}

	if (data.password !== data.passwordConfirm) {
		return false;
	}

	logger.error("Unknown error when checking password confirmation.", { ...LOGGER_LABEL, function: "passwordConfirmationMatches" });
	return false;
}

module.exports = { create, updateUsername, updatePassword };
