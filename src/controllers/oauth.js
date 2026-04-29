/* --- License
 * File: /src/controllers/oauth.js
 * Project: account-server
 * Created Date: 28 April 2026
 * Copyright (c) 2026 OpenMinerva
 * License: MIT License
 * Authors: Armored Dragon
 * --- License */

const authService = require("../services/auth");

const callback = async (req, res, next) => {
	// FIXME:
	// This is ran when we are wanting to exchange the authorization code for a access token.
	// This is not meant to be used in production and needs to be removed after testing!

	// FIXME:
	// Figure out how to do this cookie setting thing without making a request through the web.
	// Is this normal?

	const COOKIE_SETTINGS = {
		httpOnly: false,
		secure: process.env.NODE_ENV === "production",
		sameSite: "lax",
		maxAge: 24 * 60 * 60 * 1000,
	};

	const { code } = req.query;

	if (!code) {
		return res.send("No code found in URL. Did authorization succeed?");
	}

	try {
		// Request the tokens
		const response = await fetch(`${process.env.HOST_URL}/oauth/token`, {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				grant_type: "authorization_code",
				code: code,
				redirect_uri: `${process.env.HOST_URL}/oauth/callback`,
				client_id: "OpenMinerva-Web",
				code_verifier: req.session.oauth.code_verifier,
			}),
		});

		const tokens = await response.json();
		res.cookie("token", tokens.id_token, COOKIE_SETTINGS);
		res.redirect("/");
	} catch (error) {
		console.error(error);
		res.status(500).send("Error exchanging code for tokens");
	}
};
const interactionUuid = async (req, res, next) => {
	const oidc = req.app.get("oidc-provider");

	try {
		const interaction = await oidc.Interaction.find(req.params.uid);

		if (!interaction) {
			return res.status(404).send("Interaction not found");
		}

		if (interaction.prompt.name === "login") {
			res.send(`
                <!DOCTYPE html>
                <html>
                <body>
                <h1>Login to Account Server</h1>
                <form method="POST" action="/oauth/interaction/${req.params.uid}/confirm">
                    <label>Username: <input type="text" name="username" /></label><br/>
                    <label>Password: <input type="password" name="password" /></label><br/>
                    <button type="submit">Log In</button>
                </form>
                </body>
                </html>
            `);
		} else if (interaction.prompt.name === "consent") {
			res.send(`
            <form method="POST" action="/oauth/interaction/${req.params.uid}/confirm">
            <h2>Authorize App?</h2>
            <p>This app wants to access your account.</p>
            <button type="submit">Authorize</button>
            </form>
        `);
		} else {
			// TODO: Generic error
			// res.status(400).send(`Unexpected prompt: ${interaction.prompt.name}`);
		}
	} catch (e) {
		next(e);
	}
};

const interactionConfirm = async (req, res, next) => {
	const oidc = req.app.get("oidc-provider");

	try {
		const details = await oidc.interactionDetails(req, res);
		const {
			prompt: { name, details: promptDetails },
			params,
			session,
		} = details;
		let result = { ...(details.lastSubmission || {}) };

		if (name === "login") {
			const { username, password } = req.body;
			const user = await authService.authLogin({ username, password });

			// TODO: Redirect to a dedicated invalid credentials page.
			if (!user || user.ok === false) {
				return res.status(400).send("Invalid credentials");
			}

			result.login = {
				accountId: user.data.id,
			};

			// TODO: Replace with interactionFinished?
			await oidc.interactionResult(req, res, result);
			return res.redirect(302, `/oauth/authorize/${req.params.uid}`);
		}

		if (name === "consent") {
			let grant;
			const { grantId } = details;

			// Check if we need a new grant or to load an existing one
			if (grantId) {
				grant = await oidc.Grant.find(grantId);
			} else {
				// Create a new Grant object
				grant = new oidc.Grant({
					accountId: session.accountId,
					clientId: params.client_id,
				});
			}

			// Add the requested scopes to the Grant
			if (promptDetails.missingOIDCScope) {
				grant.addOIDCScope(promptDetails.missingOIDCScope.join(" "));
			}

			// Add claims if necessary
			if (promptDetails.missingOIDCClaims) {
				grant.addOIDCClaims(promptDetails.missingOIDCClaims);
			}

			const savedGrantId = await grant.save();

			result.consent = {
				grantId: savedGrantId,
			};
		}

		await oidc.interactionFinished(req, res, result);
	} catch (e) {
		// TODO: What actually should be done here?
		console.log(e);
		next(e);
	}
};

module.exports = { callback, interactionUuid, interactionConfirm };
