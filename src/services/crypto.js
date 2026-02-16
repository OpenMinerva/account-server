const bcrypt = require("bcrypt");
const crypto = require("crypto");
const fs = require("fs")
const logger = require('../services/logger');
const jwt = require("jsonwebtoken");

let privateKey = null;
let publicKey = null;

async function hashPassword(plainPassword, hashRounds = 12) {
    return await bcrypt.hash(plainPassword, hashRounds);
}

async function comparePassword(password, passwordHash) {
    try {
        const passwordResult = await bcrypt.compare(password, passwordHash);
        return { ok: true, response: passwordResult }
    } catch (e) {
        logger.error("Unknown error comparing password to password hash.", e)
        return { ok: false, message: "Unknown error comparing password to password hash." }
    }
}

async function createJWT(accountData, scope = "private_account_server_jwt", deviceId = null) {
    if (!accountData.id) {
        return { ok: false, message: "No ID specified." }
    }
    if (!accountData.username) {
        return { ok: false, message: "No username specified." }
    }
    if (!accountData.role) {
        return { ok: false, message: "No role specified." }
    }

    const info = {
        id: accountData.id,
        username: accountData.username,
        role: accountData.role,
        scope: scope,
        issuer: "http://localhost:40400",
        deviceId
    }

    // TODO: Remember me, extend expiresIn
    const token = jwt.sign(info, privateKey, { expiresIn: "1d", algorithm: 'RS256' });

    return { ok: true, response: token }
}

async function verifyJWT(token) {
    try {
        const verification = await jwt.verify(token, privateKey);

        if (verification.scope != "private_account_server_jwt") {
            return { ok: false, message: "Invalid scope." }
        }

        return { ok: true, response: verification }
    } catch (e) {
        return { ok: false, message: "Unknown error." }
    }
}

/**
 * Generates a public and private keypair.
 * Will then store the keypair to disk
 */
async function generateKeyPairs({ saveToDisk = true } = {}) {
    const keys = crypto.generateKeyPairSync("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    });

    // Save to the variables.
    privateKey = keys.privateKey
    publicKey = keys.publicKey

    // Save to disk for persistence.
    await fs.mkdirSync("./data/keys/", { recursive: true });

    fs.writeFileSync("./data/keys/public.pem", keys.publicKey);
    fs.writeFileSync("./data/keys/private.pem", keys.privateKey);
}

/**
 * Returns the current private key of the instance.
 *
 * @returns {string} The current private key.
 */
function getPrivKey() {
    return privateKey;
}

/**
 * Returns the current public key of the instance.
 *
 * @returns {string} The current public key.
 */
function getPubKey() {
    return publicKey;
}

// FIXME: If keys are not available, will error.
publicKey = fs.readFileSync("./data/keys/public.pem") || null
privateKey = fs.readFileSync("./data/keys/private.pem") || null

module.exports = { hashPassword, comparePassword, createJWT, verifyJWT, getPrivKey, getPubKey }