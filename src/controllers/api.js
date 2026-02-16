const jwt = require("jsonwebtoken");

const accountService = require('../services/account');
const deviceService = require('../services/device');
const authService = require('../services/auth');
const logger = require('../services/logger');
const crypto = require("../services/crypto")

async function getAccount(req, res, next) {
	res.status(200).json({ ok: true });
	return;
}
async function createAccount(req, res, next) {
	const dbResponse = await accountService.createAccount({ username: req.body.username, password: req.body.password });

	if (dbResponse.ok == false) {
		res.status(200).json(dbResponse);
		return;
	}

	res.status(200).json({ ok: true, response: dbResponse.response });
	return;
}
async function patchAccount(req, res, next) {
	res.status(200).json({ ok: true });
	return;
}
async function deleteAccount(req, res, next) {
	res.status(200).json({ ok: true });
	return;
}

async function getDevice(req, res, next) {
	return;
}
async function createDevice(req, res, next) {
	return;
}
async function deleteDevice(req, res, next) {
	return;
}

async function authDevice(req, res, next) {
	// A client tries to sign into their account using the application.
	try {
		// username, password, pubKey
		const COOKIE_SETTINGS = {
			httpOnly: false,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 24 * 60 * 60 * 1000,
		};

		const response = await authService.authLogin({ username: req.body.username, password: req.body.password });

		if (response.ok == false) {
			res.status(403).json({ ok: false, ...response });
			return
		}

		// TODO: Verify that the provided key is a key that we expect.
		const existingDevice = await deviceService.getDevice({ userId: response.response.id, pubKey: req.body.pubKey });

		// DEBUG:
		if (existingDevice) {
			logger.debug("This device is already registered to the account.");
		}
		else {
			logger.debug("This device has not been registered to this account yet.");
			await deviceService.createDevice({ pubKey: req.body.pubKey, userId: response.response.id });
		}

		const jwtToken = await crypto.createJWT(response.response, "public_account_server_passport", existingDevice.id || null);

		if (jwtToken.ok == false) {
			logger.error("Unknown error creating a JWT.", jwtToken.message);
			res.status(500).json({ ok: false });
			return
		}

		res.cookie("token", jwtToken.response, COOKIE_SETTINGS).json({ ok: true })
	} catch (e) {
		logger.error("Unknown error creating a JWT.", e);
		res.status(500).json({ ok: false });
	}
}

async function authLogin(req, res, next) {
	try {
		const COOKIE_SETTINGS = {
			httpOnly: false,
			secure: process.env.NODE_ENV === "production",
			sameSite: "lax",
			maxAge: 24 * 60 * 60 * 1000,
		};

		const response = await authService.authLogin({ username: req.body.username, password: req.body.password });

		if (response.ok == false) {
			res.status(403).json({ ok: false, ...response });
			return
		}

		let jwtToken = null;

		jwtToken = await crypto.createJWT(response.response, "private_account_server_jwt");

		if (jwtToken.ok == false) {
			logger.error("Unknown error creating a JWT.", jwtToken.message);
			res.status(500).json({ ok: false });
			return
		}

		res.cookie("token", jwtToken.response, COOKIE_SETTINGS).json({ ok: true })
	} catch (e) {
		logger.error("Unknown error creating a JWT.", e);
		res.status(500).json({ ok: false });
	}
}

module.exports = { getAccount, createAccount, patchAccount, deleteAccount, getDevice, createDevice, deleteDevice, authDevice, authLogin }