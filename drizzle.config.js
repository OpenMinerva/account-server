const { defineConfig } = require("drizzle-kit");

module.exports = defineConfig({
	dialect: "sqlite",
	schema: "./src/db/schema.js",
	out: "./data/drizzle",
	dbCredentials: { url: "./data/prism-account-server.db" },
});
