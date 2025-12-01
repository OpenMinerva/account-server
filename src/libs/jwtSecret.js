const crypto = require("crypto");

/**
 * Generates a random secret.
 *
 * @returns {string} A random string of 120 characters.
 */
function generateSecret() {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
	return [...crypto.getRandomValues(new Uint8Array(120))].map((b) => charset.charAt(b & 95)).join("");
}

/**
 * Current secret used for signing and verifying JWTs.
 */
let currentSecret = generateSecret();

/**
 * Rotates the JWT secret.
 */
function rotateSecret() {
	currentSecret = generateSecret();
}

/**
 * Exposes the current secret.
 *
 * @returns {string} The current JWT secret.
 */
function getSecret() {
	return currentSecret;
}

module.exports = {
	getSecret,
	rotateSecret,
};
