const db = require("../db/index.js");
const bcrypt = require("bcrypt");

async function checkUserPassword(password, hashedPassword) {
	return await bcrypt.compare(password, hashedPassword);
}

module.exports = { checkUserPassword };
