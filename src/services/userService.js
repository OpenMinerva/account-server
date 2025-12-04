const db = require("../db/index.js");
const logger = require("../libs/logger.js");
const LOGGER_LABEL = { file: "userService.js" };

const get = async (identifiers, requestingUser) => await db.getUser(identifiers, requestingUser);

async function create(data) {
	logger.info(`Creating user '${data.username}'.`, { ...LOGGER_LABEL, function: "create" });
	let userId = await db.insertUser(data);
	return userId;
}

async function updateUsername(id, username) {
	logger.info(`Updating username of '${id}'.`, { ...LOGGER_LABEL, function: "updateUsername" });
	await db.updateUserUsername(id, username);
}

async function updatePassword(id, password) {
	logger.info(`Updating password of '${id}'.`, { ...LOGGER_LABEL, function: "updatePassword" });
	await db.updateUserPassword(id, password);
}
async function updateRole(id, role = "") {
	logger.info(`Updating role of '${id}'.`, { ...LOGGER_LABEL, function: "updateRole" });
	await db.updateUserRole(id, role);
}

module.exports = { get, create, updateUsername, updatePassword, updateRole };
