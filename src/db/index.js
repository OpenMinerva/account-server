const { db } = require("./db");
const { accounts, devices } = require("./schema");
const { eq } = require("drizzle-orm");
const crypto = require("../services/crypto");
const logger = require("../services/logger");
const ensureSetup = require("../services/setup");

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

// FIXME: Always returns a device for userId even if the pubkey is different.
async function getDevice({ id, pubKey, userId } = {}) {
	try {
		let selectQuery = {
			id: devices.id,
			pubKey: devices.pubKey,
			userId: devices.userId
		};

		if (id) {
			const dev = (await db.select(selectQuery).from(devices).where(eq(devices.id, id)))[0];
			return dev;
		}

		if (userId && pubKey) {
			const dev = (await db.select(selectQuery).from(devices).where(eq(devices.userId, userId), eq(devices.pubKey, pubKey)))[0];
			return dev;
		}

		return await db.select(selectQuery).from(devices)
	}
	catch (e) {
		logger.error("Unknown error trying to search for a device.", e);
		return { ok: false, message: "Unknown error." }
	}
}
async function createDevice({ pubKey, userId } = {}) {
	try {
		logger.info(`Creating a device for '${userId}'`);
		const deviceDatabaseResponse = await db.insert(devices).values({ userId, pubKey, deviceName: "Hallo" }).returning()
		return deviceDatabaseResponse.id
	}
	catch (e) {
		logger.error("Unknown error trying to add a device to a account.", e);
		return { ok: false, message: "Unknown error." }
	}
}
async function deleteDevice({ id } = {}) { }

async function authDevice({ } = {}) { }
async function authLogin({ username, password } = {}) {
	try {
		const targetAccount = getAccount({ username });

		if (!targetAccount) {

		}
	} catch (e) {

	}
}

module.exports = { getAccount, createAccount, getDevice, createDevice, deleteDevice, authLogin }