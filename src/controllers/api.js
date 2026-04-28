const jwt = require("jsonwebtoken");

const accountService = require('../services/account');
const deviceService = require('../services/device');
const authService = require('../services/auth');
const logger = require('../services/logger');
const crypto = require("../services/crypto")

async function getAccount(req, res, next) {
	const username = req?.query?.username || null;
	const id = req?.query?.id || null;

	const dbResponse = await accountService.getAccount({ id, username });

	res.status(200).json({ ok: true, response: dbResponse });
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
async function createDevice(req, res, next) {
	const dbResponse = await deviceService.createDevice({ public_key: req.body.public_key, owner_id: req.requestingUser.id });
	res.status(200).json({ ok: true, response: dbResponse[0] });
}

function _isRequestAllowedToViewPage(req) {
	if (req.requestingUser == req.params.account_id) {
		// Target page is of the user who is logged in
		return true
	}

	if (req.requestingUser.role == "admin") {
		// Admins can see all
		return true
	}

	return false
}

module.exports = { getAccount, createAccount, patchAccount, deleteAccount, createDevice }