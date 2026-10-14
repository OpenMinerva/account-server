/* --- License
 * File: /src/middleware/requireAuth.js
 * Project: account-server
 * Created Date: 04 December 2025
 * Copyright (c) 2026 OpenMinerva
 * License: MIT License
 * Authors: Armored Dragon
 * --- License */

const crypto = require("../services/crypto.js");
const logger = require("../services/logger");

module.exports = async function auth(req, res, next) {
	const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
	if (!token) return res.redirect("/");

	logger.debug("Validating request token.");
	try {
		const decoded = await crypto.verifyJWT(token);

		if (decoded.ok == true) {
			req.requestingUser = decoded.data;
			next();
			return;
		}

		res.status(401).redirect("/");
		return;
	} catch {
		res.status(401).redirect("/");
		return;
	}
};
