/* --- License
 * File: /src/services/auth.js
 * Project: account-server
 * Created Date: 21 January 2026
 * Copyright (c) 2026 OpenMinerva
 * License: MIT License
 * Authors: Armored Dragon
 * --- License */

const cryptoLib = require("../services/crypto");
const accountService = require("../services/account");
const logger = require("../services/logger");

async function authLogin({ username, password }) {
	try {
		logger.debug(`Attempting to authorize a login.`);
		const targetAccount = await accountService.getAccount({ username }, { includePassword: true });

		if (!targetAccount) {
			logger.debug(`No account found from username.`);
			return { ok: false, message: "No account found." };
		}

		const passwordMatches = await cryptoLib.comparePassword(password, targetAccount.password);

		if (passwordMatches.ok == true && passwordMatches.data == true) {
			// We do not need the password beyond verifying it.
			let responseAccount = targetAccount;
			delete responseAccount.password;
			logger.debug(`User authorized as account '${responseAccount.username}'.`);

			return { ok: true, response: responseAccount };
		}

		return { ok: false, ...passwordMatches };
	} catch (e) {
		return false;
	}
}

module.exports = { authLogin };
