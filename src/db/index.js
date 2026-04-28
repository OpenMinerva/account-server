const { db } = require("./db");
const { accounts, devices } = require("./schema");
const { eq, and } = require("drizzle-orm");
const crypto = require("../services/crypto");
const logger = require("../services/logger");
const ensureSetup = require("../services/setup");
const { randomUUID } = require("crypto")

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

	return await db.select(selectQuery).from(accounts)
}
async function createAccount({ username, password, role } = {}) {
	try {
		if (!username) {
			logger.warn("Tried to make a account without a username.");
			return { ok: false, message: "No username." }
		}
		if (!password) {
			logger.warn("Tried to make a account without a password.");
			return { ok: false, message: "No password." }
		}

		const existingAccount = await getAccount({ username });

		if (existingAccount) {
			return { ok: false, message: "Username is already in use." }
		}

		password = await crypto.hashPassword(password);

		if (await ensureSetup.check() == false) {
			logger.info(`Server is not set up, making ${username} an admin.`);
			role = "admin";

		}

		const accountDatabaseResponse = await db.insert(accounts).values({ username, password, role }).returning()
		ensureSetup.setState(true)
		return { ok: true, response: accountDatabaseResponse[0] };
	}
	catch (e) {
		logger.error("Unknown error trying to make a account.", e);
		return { ok: false, message: "Unknown error." }
	}
}
async function updateAccount({ } = {}) { }
async function deleteAccount({ } = {}) { }

async function getDevice({ id }) {
	try { }
	catch (e) {
		logger.error("Unknown error trying to get a device.", e);
		return { ok: false, message: "Unknown error." }
	}
}
async function createDevice({ public_key, owner_id } = {}) {
	try {
		if (!public_key) {
			logger.warn("Tried to add a device without a public key.");
			return { ok: false, message: "No public key specified." }
		}
		if (!owner_id) {
			logger.warn("Tried to add a device without a owner.");
			return { ok: false, message: "No owner specified." }
		}

		const deviceDatabaseResponse = await db.insert(devices).values({ ownerId: owner_id, pubKey: public_key, deviceName: randomUUID() }).returning()

		return { ok: true, response: deviceDatabaseResponse }
	}
	catch (e) {
		let error_message = "Unknown error trying to add a device to a account."

		if (e.message.includes("NOT NULL constraint failed")) {
			error_message = "Not NULL constraint failed."
		}

		logger.error(error_message, e);
		return { ok: false, message: error_message }
	}
}

module.exports = { getAccount, createAccount, getDevice, createDevice }