const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");
const { Provider } = require('oidc-provider');
const session = require('express-session');
require('dotenv').config()
const logger = require('./services/logger');

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
// FIXME: Throw an error about server being ran in developer mode.
app.use(session({
	secret: process.env.SESSION_SECRET || 'OH23498SDFKJGS8923HJSDF980G=23-4=2439U',
	resave: false,
	saveUninitialized: true,
	cookie: {
		secure: process.env.NODE_ENV === 'production',
		httpOnly: true,
		sameSite: 'lax',
		maxAge: 24 * 60 * 60 * 1000
	}
}));

const OAUTH_CONFIG = {
	issuer: process.env.HOST_URL,

	clients: [
		{
			client_id: 'OpenMinerva-Game-Client',
			redirect_uris: [`http://127.0.0.1:54000`],
			grant_types: ['authorization_code', 'refresh_token'],
			response_types: ['code'],
			application_type: 'native',
			token_endpoint_auth_method: 'none'
		},
		{
			client_id: 'OpenMinerva-Web',
			redirect_uris: [`${process.env.HOST_URL}/oauth/callback`],
			grant_types: ['authorization_code'],
			response_types: ['code'],
			application_type: 'web',
			token_endpoint_auth_method: 'none'
		},
	],
	ttl: {
		// Authorization Code: Short-lived
		AuthorizationCode: 10 * 60,
		// Access Token: Short-lived
		AccessToken: 60 * 60,
		IdToken: 60 * 60,
		// Refresh Token: Long-lived 
		RefreshToken: 14 * 24 * 60 * 60,
		// Session: Interaction Session (Login state)
		Session: 12 * 60 * 60
	},
	cookies: {
		keys: [
			'some-very-long-random-secret-key',
			'another-long-key-for-rotation'
		],
	},
	claims: {
		openid: ['sub', 'role', 'preferred_username'],
	},

	features: {
		devInteractions: { enabled: false },
		registration: { enabled: true },
		registrationManagement: { enabled: true },
		introspection: { enabled: true },
		// TODO: IS Revocation what I need to revoke login tokens?
		// revocation: { enabled: false }
	},

	routes: {
		authorization: '/authorize',
		token: '/token',
		jwks: '/jwks',
		registration: '/register',
	},

	interactions: {
		url: (ctx, interaction) => {
			return `/oauth/interaction/${interaction.uid}`;
		},
	},

	async findAccount(ctx, id) {
		let response = await fetch(`${process.env.HOST_URL}/api/v1/account?id=${id}`, {
			method: 'GET',
			headers: { 'Accept': 'application/json' }
		});
		response = await response.json();
		response = response.response;

		return {
			accountId: response.id,

			claims: (use, scope, claims, denied) => {
				return {
					sub: response.id,
					preferred_username: response.username,
					role: response.role
				}
			}

		}
	},

	jwks: JSON.parse(fs.readFileSync('data/keys/private.json', 'utf8'))
};
const oidc = new Provider(process.env.HOST_URL, OAUTH_CONFIG);

app.set('oidc-provider', oidc);

// Routes
// API is required to make an account. If this is after ensuring the setup we would be caught in a loop!
app.use("/api", apiRoutes);
app.use(ensureSetup.middleware);
app.use("/account", accountRoutes);
// app.use("/admin", adminRoutes);
app.use("/", indexRoutes);
app.use("/oauth", oauthRoutes);
app.use('/oauth', oidc.callback());

app.use(errorHandler);

oidc.on('error', (err, ctx) => {
	logger.error("OIDC Provider error", { err, ctx })
});

// oidc.on('interaction.ended', (ctx) => {
// 	logger.debug("OIDC Interaction ended", { ctx })
// });
module.exports = app;