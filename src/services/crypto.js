/* --- License
 * File: /src/services/crypto.js
 * Project: account-server
 * Created Date: 21 January 2026
 * Copyright (c) 2026 OpenMinerva
 * License: MIT License
 * Authors: Armored Dragon
 * --- License */

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const fs = require("fs");
const logger = require("../services/logger");
const jose = require("jose");
const resBuilder = require("./responseBuilder");

const PUB_KEY_DIR = "./data/keys/public.json";
const PRIV_KEY_DIR = "./data/keys/private.json";

let _privateKey = null;
let _publicKey = null;

async function hashPassword(plainPassword, hashRounds = 12) {
	return await bcrypt.hash(plainPassword, hashRounds);
}
async function comparePassword(password, passwordHash) {
	try {
		const passwordResult = await bcrypt.compare(password, passwordHash);

		return resBuilder.success(passwordResult);
	} catch (e) {
		logger.error("Unknown error comparing password to password hash.", e);

		return resBuilder.error("Unknown error comparing password to password hash.");
	}
}
async function verifyJWT(token) {
	try {
		// TODO: Change this so that it works with the rotated key?
		let { payload, protectedHeader } = await jose.jwtVerify(token, _publicKey.keys[0]);

		if (payload.aud != "OpenMinerva-Web") {
			logger.debug("JWT had an invalid scope.");
			return resBuilder.error("Invalid scope.");
		}

		return resBuilder.success(payload);
	} catch (e) {
		let message = "Unknown error.";

		if (e.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED") {
			message = "JWT signature verification failed.";
		}

		logger.error(e.message);
		return resBuilder.error(message);
	}
}

async function generateKeys() {
	const keys = await jose.generateKeyPair("RS256", { modulusLength: 4096, extractable: true });
	const kid = crypto.randomBytes(16).toString("hex");
	const privateKeyExists = fs.existsSync(PRIV_KEY_DIR);
	const pubKeyExists = fs.existsSync(PUB_KEY_DIR);

	// Setup the private key
	const privateKeyJwk = await jose.exportJWK(keys.privateKey);
	privateKeyJwk.alg = "RS256";
	privateKeyJwk.use = "sig";
	privateKeyJwk.kid = kid;

	// Setup the public key
	const publicKeyJwk = await jose.exportJWK(keys.publicKey);
	publicKeyJwk.alg = "RS256";
	publicKeyJwk.use = "sig";
	publicKeyJwk.kid = kid;

	if (privateKeyExists && pubKeyExists) {
		// Prepend the generated keys to our key store.
		let _privateFileContents = null;
		let _publicFileContents = null;

		// Private keys
		_privateFileContents = fs.readFileSync(PRIV_KEY_DIR);
		if (_privateFileContents) {
			_privateFileContents = JSON.parse(_privateFileContents);
		}
		_privateFileContents.keys.unshift(privateKeyJwk);
		_privateFileContents.keys = _privateFileContents.keys.slice(0, 2);

		// Public keys
		_publicFileContents = fs.readFileSync(PRIV_KEY_DIR);
		if (_publicFileContents) {
			_publicFileContents = JSON.parse(_publicFileContents);
		}
		_publicFileContents.keys.unshift(publicKeyJwk);
		_publicFileContents.keys = _publicFileContents.keys.slice(0, 2);

		// Write to disk.
		fs.writeFileSync(PRIV_KEY_DIR, JSON.stringify(_privateFileContents, null, 2));
		fs.writeFileSync(PUB_KEY_DIR, JSON.stringify(_publicFileContents, null, 2));

		// Update the current variable
		_publicKey = publicKeyJwk;
		_privatecKey = privateKeyJwk;

		// Successfully added/rotated the keys.
		return;
	}
	// Format the object so that we can save it to disk.
	const privateJwks = { keys: [privateKeyJwk] };
	const publicJwks = { keys: [publicKeyJwk] };

	// Write the keys to disk.
	fs.writeFileSync(PRIV_KEY_DIR, JSON.stringify(privateJwks, null, 2));
	fs.writeFileSync(PUB_KEY_DIR, JSON.stringify(publicJwks, null, 2));
}

async function readKeys() {
	logger.debug("Attempting to read jose keys from disk.");
	const privateKeyExists = fs.existsSync(PRIV_KEY_DIR);
	const pubKeyExists = fs.existsSync(PUB_KEY_DIR);

	let _privateFileContents = null;
	let _publicFileContents = null;

	if (!privateKeyExists || !pubKeyExists) {
		logger.info("Public / Private jose keys were not found. Generating a new pair.");
		await generateKeys();
	}

	_privateFileContents = fs.readFileSync(PRIV_KEY_DIR);
	_privateFileContents = JSON.parse(_privateFileContents);
	_privateKey = _privateFileContents;

	_publicFileContents = fs.readFileSync(PUB_KEY_DIR);
	_publicFileContents = JSON.parse(_publicFileContents);
	_publicKey = _publicFileContents;
}

async function getPrivateKey() {
	if (!_privateKey) {
		await readKeys();
	}

	return _privateKey;
}

async function getPublicKeyPEM() {
	if (!_publicKey) {
		return "";
	}
	return await jose.exportSPKI(_publicKey);
}

module.exports = { hashPassword, comparePassword, verifyJWT, generateKeys, getPrivateKey, getPublicKeyPEM };
