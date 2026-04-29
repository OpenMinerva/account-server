/* --- License
 * File: /src/controllers/api.js
 * Project: account-server
 * Created Date: 21 January 2026
 * Copyright (c) 2026 OpenMinerva
 * License: MIT License
 * Authors: Armored Dragon
 * --- License */

const accountService = require("../services/account");
const deviceService = require("../services/device");
const authService = require("../services/auth");
const logger = require("../services/logger");
const crypto = require("../services/crypto");
const resBuilder = require("../services/responseBuilder");

async function getAccount(req, res, next) {
	logger.debug("Retrieving an account using the API.");
	const username = req?.query?.username || null;
	const id = req?.query?.id || null;

	const dbResponse = await accountService.getAccount({ id, username });

	res.status(200).json(resBuilder.success(dbResponse));
	return;
}
async function createAccount(req, res, next) {
	logger.debug("Creating an account using the API.");
	const dbResponse = await accountService.createAccount({ username: req.body.username, password: req.body.password });

	if (dbResponse.ok === false) {
		res.status(200).json(dbResponse);
		return;
	}

	res.status(200).json(resBuilder.success(dbResponse.response));
	return;
}
async function patchAccount(req, res, next) {
	logger.debug("Updating an account using the API.");
	res.status(200).json(resBuilder.success());
	return;
}
async function deleteAccount(req, res, next) {
	logger.debug("Deleting an account using the API.");
	res.status(200).json(resBuilder.success());
	return;
}
async function createDevice(req, res, next) {
	logger.debug("Creating a device using the API.");
	const dbResponse = await deviceService.createDevice({ public_key: req.body.public_key, owner_id: req.requestingUser.id });

	res.status(200).json(resBuilder.success(dbResponse[0]));
}

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

module.exports = { getAccount, createAccount, patchAccount, deleteAccount, createDevice };
