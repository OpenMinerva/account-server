const bcrypt = require("bcrypt");
const crypto = require("crypto");
const fs = require("fs")
const logger = require('../services/logger');
const jwt = require("jsonwebtoken");
const jose = require("jose")

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
        let { payload, protectedHeader } = await jose.jwtVerify(token, publicKey);

        if (payload.aud != "OpenMinerva-Web") {
            return { ok: false, message: "Invalid scope." }
        }

        return { ok: true, response: payload };
    }
    catch (e) {
        let message = "Unknown error."
        if (e.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED") {
            message = "JWT signature verification failed.";
        }

        logger.error(message);
        return { ok: false, message }
    }
}

/**
 * Generates a public and private keypair.
 * Will then store the keypair to disk
 */
async function generateKeys({ saveToDisk = true } = {}) {
    // TODO: Key rotation
    const keys = await jose.generateKeyPair('RS256', { modulusLength: 4096, extractable: true });
    const kid = crypto.randomBytes(16).toString('hex')

    const privateKeyJwk = await jose.exportJWK(keys.privateKey);
    privateKeyJwk.alg = 'RS256';
    privateKeyJwk.use = 'sig';
    privateKeyJwk.kid = kid;
    const privateJwks = { keys: [privateKeyJwk] };
    fs.writeFileSync('./data/keys/private.json', JSON.stringify(privateJwks, null, 2));

    const publicKeyJwk = await jose.exportJWK(keys.publicKey);
    publicKeyJwk.alg = 'RS256';
    publicKeyJwk.use = 'sig';
    publicKeyJwk.kid = kid;
    const publicJwks = { keys: [publicKeyJwk] };
    fs.writeFileSync('./data/keys/public.json', JSON.stringify(publicJwks, null, 2));
}

// FIXME: If keys are not available, the application will error.
/**
 * Returns the current private key of the instance.
 *
 * @returns {string} The current private key.
 */
async function getPrivKey() {
    if (privateKey) {
        return privateKey;
    }
    privateKey = await jose.importJWK(JSON.parse(fs.readFileSync("./data/keys/private.json")).keys[0]) || null;
    return privateKey
}

/**
 * Returns the current public key of the instance.
 *
 * @returns {string} The current public key.
 */
async function getPubKey() {
    if (privateKey) {
        return publicKey;
    }
    publicKey = await jose.importJWK(JSON.parse(fs.readFileSync("./data/keys/public.json")).keys[0]) || null;
    return privateKey
}

async function _maybeGenerateKeyPairs() {
    const bothFilesExist = fs.existsSync("./data/keys/private.json") && fs.existsSync("./data/keys/public.json");

    if (bothFilesExist) {
        getPrivKey()
        getPubKey()
        logger.info("Public and private jose keys found.");
        return;
    }

    logger.info("Public and/or private jose keys not found, generating a new set.");
    await generateKeys()
    // TODO: Verify the integrity
    getPrivKey()
    getPubKey()
    return;
}

_maybeGenerateKeyPairs();

module.exports = { hashPassword, comparePassword, createJWT, verifyJWT, getPrivKey, getPubKey }