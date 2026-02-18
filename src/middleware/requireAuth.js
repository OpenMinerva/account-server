const jwt = require("jsonwebtoken");
const authService = require("../services/auth.js");
const crypto = require("../services/crypto.js");

module.exports = async function auth(req, res, next) {
    const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.redirect("/");

    try {
        const decoded = await crypto.verifyJWT(token);

        if (decoded.ok == true) {
            req.requestingUser = decoded.response;
            next();
            return;
        }

        res.status(401).redirect("/");
    } catch {
        res.status(401).redirect("/");
    }
};
