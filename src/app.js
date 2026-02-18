const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

// Routes
const indexRoutes = require("./routes/index");
const accountRoutes = require("./routes/account");
// const adminRoutes = require("./routes/admin");
const apiRoutes = require("./routes/api");

// Middleware
const errorHandler = require("./middleware/errorHandler");
const ensureSetup = require("./services/setup");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "..", "public")));
app.use(methodOverride("_method"));

// Global middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api", apiRoutes);         // API is required to make an account. If this is after ensuring the setup we would be caught in a loop!
app.use(ensureSetup.middleware);
app.use("/account", accountRoutes);
// app.use("/admin", adminRoutes);
app.use("/", indexRoutes);

app.use(errorHandler); // Everything else in an error.

module.exports = app;