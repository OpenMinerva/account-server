/* --- License
 * File: /src/db/index.js
 * Project: account-server
 * Created Date: 04 December 2025
 * Copyright (c) 2026 OpenMinerva
 * License: MIT License
 * Authors: Armored Dragon
 * --- License */

const { db } = require("./db");
const { accounts, devices } = require("./schema");
const { eq, and } = require("drizzle-orm");
const crypto = require("../services/crypto");
const logger = require("../services/logger");
const ensureSetup = require("../services/setup");
const resBuilder = require("../services/responseBuilder");
const { randomUUID } = require("crypto");

async function getAccount({ id, username, role } = {}, { includePassword = false } = {}) {
	let selectQuery = {
		id: accounts.id,
		role: accounts.role,
		dateCreated: accounts.dateCreated,
		username: accounts.username,
	};

	if (includePassword) {
		selectQuery.password = accounts.password;
	}

	// Unique constrained searches. Only return a single entry as a standalone object
	if (id) {
		const acc = (await db.select(selectQuery).from(accounts).where(eq(accounts.id, id)))[0];
		return acc;
	}

	if (username) {
		const acc = (await db.select(selectQuery).from(accounts).where(eq(accounts.username, username)))[0];
		return acc;
	}

	if (role) {
		const acc = await db.select(selectQuery).from(accounts).where(eq(accounts.role, role));
		return acc;
	}

	return await db.select(selectQuery).from(accounts);
}
async function createAccount({ username, password, role } = {}) {
	try {
		if (!username) {
			logger.warn("Tried to make a account without a username.");
			return resBuilder.error("No username.");
		}
		if (!password) {
			logger.warn("Tried to make a account without a password.");
			return resBuilder.error("No password.");
		}

		const existingAccount = await getAccount({ username });

		if (existingAccount) {
			return resBuilder.error("Username is already in use.");
		}

		password = await crypto.hashPassword(password);

		if ((await ensureSetup.check()) == false) {
			logger.info(`Server is not set up, making ${username} an admin.`);
			role = "admin";
		}

		const accountDatabaseResponse = await db.insert(accounts).values({ username, password, role }).returning();
		ensureSetup.setState(true);
		return resBuilder.success(accountDatabaseResponse[0]);
	} catch (e) {
		logger.error("Unknown error trying to make a account.", e);
		return resBuilder.error("Unknown error.");
	}
}
async function updateAccount({} = {}) {}
async function deleteAccount({} = {}) {}

async function getDevice({ id }) {
	try {
	} catch (e) {
		logger.error("Unknown error trying to get a device.", e);
		return resBuilder.error("Unknown error.");
	}
}
async function createDevice({ public_key, owner_id } = {}) {
	try {
		if (!public_key) {
			logger.warn("Tried to add a device without a public key.");
			return resBuilder.error("No public key specified.");
		}
		if (!owner_id) {
			logger.warn("Tried to add a device without a owner.");
			return resBuilder.error("No owner specified.");
		}

		const deviceDatabaseResponse = await db.insert(devices).values({ ownerId: owner_id, pubKey: public_key, deviceName: randomUUID() }).returning();

		return resBuilder.success(deviceDatabaseResponse);
	} catch (e) {
		let error_message = "Unknown error trying to add a device to a account.";

		if (e.message.includes("NOT NULL constraint failed")) {
			error_message = "Not NULL constraint failed.";
		}

		logger.error(error_message, e);
		return resBuilder.error(error_message);
	}
}

module.exports = { getAccount, createAccount, getDevice, createDevice };
