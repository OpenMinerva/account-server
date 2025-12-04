const { drizzle } = require("drizzle-orm/better-sqlite3");
const Database = require("better-sqlite3");
const schema = require("./schema");

const sqlite = new Database("./data/prism-account-server.db");
module.exports = { db: drizzle(sqlite, { schema }) };
