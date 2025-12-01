const { db } = require("./db");
const { posts, users } = require("./schema");
const { eq } = require("drizzle-orm");
const bcrypt = require("bcrypt");
const logger = require("../libs/logger");
const LOGGER_LABEL = { file: "db/index.js" };
const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function hashPassword(plainPassword, hashRounds = 12) {
	return await bcrypt.hash(plainPassword, hashRounds);
}

async function getUser({ id, username, includePassword = false } = {}) {
	let selectQuery = {
		id: users.id,
		role: users.role,
		dateCreated: users.dateCreated,
		username: users.username,
	};

	if (includePassword) {
		selectQuery.password = users.password;
	}

	if (id) {
		const user = (await db.select(selectQuery).from(users).where(eq(users.id, id)))[0];
		return user;
	}

	if (username) {
		const user = (await db.select(selectQuery).from(users).where(eq(users.username, username)))[0];
		return user;
	}

	return await db.select(selectQuery).from(users);
}

async function insertUser({ username, password, role } = {}) {
	if (!username) {
		logger.warn(`Tried to make a user without a username`, {
			...LOGGER_LABEL,
			function: "insertUser",
		});
		return { error: "No username." };
	}
	if (!password) {
		logger.warn(`Tried to make a user without a password`, {
			...LOGGER_LABEL,
			function: "insertUser",
		});
		return { error: "No password." };
	}

	try {
		password = await hashPassword(password);
		const userResponse = await db.insert(users).values({ username, password, role }).returning();
		return userResponse[0];
	} catch (e) {
		const msg = e instanceof Error ? e.stack : String(e);
		logger.error(`Unknown error trying to make a user.`, {
			...LOGGER_LABEL,
			error: msg,
			function: "insertUser",
		});
		return { error: "Unknown error", e };
	}
}

module.exports = { getUser, insertUser, hashPassword };
