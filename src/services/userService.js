const db = require("../db/index.js");
const logger = require("../libs/logger.js");
const LOGGER_LABEL = { file: "userService.js" };

const get = async (identifiers, requestingUser) => await db.getUser(identifiers, requestingUser);

async function create(data) {
	logger.info(`Creating user '${data.username}'.`, { ...LOGGER_LABEL, function: "create" });
	let userId = await db.insertUser(data);
	return userId;
}

async function update(id, data) {
	logger.info(`Updating user '${id}'.`, { ...LOGGER_LABEL, function: "update" });
	await db.updateUser(id, data);
}

module.exports = { get, create, update };
