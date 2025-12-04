const { sqliteTable, text, integer } = require("drizzle-orm/sqlite-core");
const { sql, relations } = require("drizzle-orm");
const { randomUUID } = require("crypto");

const users = sqliteTable("users", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => randomUUID()),
	username: text("username").notNull(),
	password: text("password").notNull(),
	role: text("role", { enum: ["user", "moderator", "admin"] })
		.default("user")
		.notNull(),
	dateCreated: integer("dateCreated", { mode: "timestamp_ms" })
		.default(sql`(unixepoch() * 1000)`)
		.notNull(),
	dateDeleted: integer("dateDeleted", { mode: "timestamp_ms" }),
	deleteRequested: integer("deleteRequested", { mode: "boolean" }).default(false),
});

module.exports = { users };
