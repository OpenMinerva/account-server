/* --- License
 * File: /server.js
 * Project: account-server
 * Created Date: 04 December 2025
 * Copyright (c) 2026 OpenMinerva
 * License: MIT License
 * Authors: Armored Dragon
 * --- License */

require("dotenv").config();
const app = require("./src/app");
const logger = require("./src/services/logger");

const PORT = process.env.PORT || 40400;

// Check for configuration errors.
if (!process.env.SESSION_SECRET) {
	logger.error("Environment variable 'SESSION_SECRET' is not defied. You must provide a secure secret phrase before launching the account-server.");
	process.exit();
}
if (!process.env.PRIMARY_KEY) {
	logger.error("Environment variable 'PRIMARY_KEY' is not defied. You must provide a secure PRIMARY_KEY value before launching the account-server.");
	process.exit();
}
if (!process.env.SECONDARY_KEY) {
	logger.info("Environment variable 'SECONDARY_KEY' is not defied. If you are launching this server for the first time and have not rotated your keys before, this is expected.");
}

// No configuration errors, start the server.
app.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}`);
});
