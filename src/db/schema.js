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

const devices = sqliteTable("devices", {
	id: text("id").primaryKey().unique().$defaultFn(() => randomUUID()),
	deviceName: text("deviceName").notNull(),
	ownerId: text("ownerId").notNull(),
	pubKey: text("pubKey").notNull().unique(),
	dateCreated: integer("dateCreated", { mode: "timestamp_ms" }).default(sql`(unixepoch() * 1000)`).notNull(),
	dateDeleted: integer("dateDeleted", { mode: "timestamp_ms" })
});

const accountsRelations = relations(accounts, ({ many }) => ({
	devices: many(devices)
}));

const devicesRelations = relations(devices, ({ one }) => ({
	user: one(accounts, { fields: [devices.ownerId], references: [accounts.id] })
}));

module.exports = { accounts, devices };
