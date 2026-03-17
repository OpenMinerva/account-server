const { sqliteTable, text, integer } = require("drizzle-orm/sqlite-core");
const { sql, relations } = require("drizzle-orm");
const { randomUUID } = require("crypto");

const accounts = sqliteTable("accounts", {
	id: text("id").primaryKey().unique().$defaultFn(() => randomUUID()),
	username: text("username").notNull().unique(),
	password: text("password").notNull(),
	role: text("role", { enum: ["user", "moderator", "admin"] }).default("user").notNull(),
	dateCreated: integer("dateCreated", { mode: "timestamp_ms" }).default(sql`(unixepoch() * 1000)`).notNull(),
	dateDeleted: integer("dateDeleted", { mode: "timestamp_ms" }),
	deleteRequested: integer("deleteRequested", { mode: "boolean" }).default(false),
});

module.exports = { accounts };
