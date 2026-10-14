/* --- License
 * File: /src/controllers/account.js
 * Project: account-server
 * Created Date: 21 January 2026
 * Copyright (c) 2026 OpenMinerva
 * License: MIT License
 * Authors: Armored Dragon
 * --- License */

const accountService = require("../services/account");

const getAccount = async (req, res, next) => {
	try {
		const dbResponse = await accountService.getAccount({ id: req.params.account_id });

		if (!dbResponse) {
			// User not found
			res.status(404).redirect("/");
			return;
		}

		if (dbResponse.ok == false) {
			res.status(200).json(dbResponse);
			return;
		}

		res.render("accountSingle", { requestingUser: req.requestingUser, targetUser: dbResponse });
	} catch (err) {
		next(err);
	}
};

const getAccountSettings = async (req, res, next) => {
	try {
		if (_isRequestAllowedToViewPage(req) == false) {
			res.status(403).redirect("/");
			return;
		}

		const dbResponseAccount = await accountService.getAccount({ id: req.params.account_id });

		if (!dbResponseAccount) {
			// User not found
			res.status(404).redirect("/");
			return;
		}

		if (dbResponseAccount.ok == false) {
			res.status(200).json(dbResponseAccount);
			return;
		}

		res.render("accountSettings", { requestingUser: req.requestingUser, targetUser: dbResponseAccount });
	} catch (err) {
		next(err);
	}
};

function _isRequestAllowedToViewPage(req) {
	if (req.requestingUser == req.params.account_id) {
		// Target page is of the user who is logged in
		return true;
	}

	if (req.requestingUser.role == "admin") {
		// Admins can see all
		return true;
	}

	return false;
}

module.exports = { getAccount, getAccountSettings };
