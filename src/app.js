const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const { Provider } = require('oidc-provider');
require('dotenv').config()

const fs = require("fs");

// Routes
const indexRoutes = require("./routes/index");
const accountRoutes = require("./routes/account");
// const adminRoutes = require("./routes/admin");
const apiRoutes = require("./routes/api");
const oauthRoutes = require("./routes/oauth");

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

const OAUTH_CONFIG = {
	issuer: process.env.HOST_URL,

	clients: [{
		client_id: 'OpenMinerva Game Client',
		redirect_uris: [`${process.env.HOST_URL}/callback`, `org.openminerva.auth://oauth/callback`],
		grant_types: ['authorization_code'],
		response_types: ['code'],
		application_type: 'native',
		token_endpoint_auth_method: 'none'
	}],

	features: {
		dPoP: { enabled: true },
	},

	routes: {
		authorization: '/authorize',
		token: '/token',
		jwks: '/jwks',
		registration: '/register',
	},

	jwks: JSON.parse(fs.readFileSync('data/keys/oidc-private-keys.json', 'utf8'))
};
const oidc = new Provider(process.env.HOST_URL, OAUTH_CONFIG);

app.set('oidc-provider', oidc);
app.use('/oauth', oidc.callback());

// Routes
// API is required to make an account. If this is after ensuring the setup we would be caught in a loop!
app.use("/api", apiRoutes);
app.use(ensureSetup.middleware);
app.use("/account", accountRoutes);
// app.use("/admin", adminRoutes);
app.use("/", indexRoutes);
app.use("/", oauthRoutes);

app.use(errorHandler); // Everything else in an error.

module.exports = app;