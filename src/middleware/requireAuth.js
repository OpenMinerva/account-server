/* --- License
 * File: /src/middleware/requireAuth.js
 * Project: account-server
 * Created Date: 04 December 2025
 * Copyright (c) 2026 OpenMinerva
 * License: MIT License
 * Authors: Armored Dragon
 * --- License */

const accountService = require("../services/account");

module.exports = async function auth(req, res, next) {
	const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
	if (!token) return res.redirect("/");

	try {
		const introspectionResponse = await fetch(`${process.env.HOST_URL}/oauth/token/introspection`, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body: new URLSearchParams({
				client_id: "OpenMinerva-Game-Client",
				token: token,
			}),
		});

		const database_response = await introspectionResponse.json();

		if (database_response.active) {
			const target_user = await accountService.getAccount({ id: database_response.sub });
			req.requestingUser = target_user;
			next();
			return;
		}

		res.status(401).redirect("/");
	} catch (e) {
		res.status(401).redirect("/");
	}
};
