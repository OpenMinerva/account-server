const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

const indexRoutes = require("./routes/index");
const createRoutes = require("./routes/create");
const apiRoutes = require("./routes/api");
const errorHandler = require("./middleware/errorHandler");

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
app.use("/api", apiRoutes);

// Routes
app.use("/signup", createRoutes);
app.use("/", indexRoutes);

// 404 & error middleware
app.use(errorHandler);

module.exports = app;
