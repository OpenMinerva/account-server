const crypto = require("../services/crypto.js");

module.exports = async function auth(req, res, next) {
    const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) return next();

    try {
        let decoded;
        if (token.access_token) {
            decoded = await crypto.verifyJWK(token);
        }
        else {
            decoded = await crypto.verifyJWT(token);
        }

        if (decoded.ok == true) {
            req.requestingUser = decoded.response;
        }
        next();
    } catch {
        next();
    }
};
