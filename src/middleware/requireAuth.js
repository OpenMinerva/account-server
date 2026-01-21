const jwt = require("jsonwebtoken");
const authService = require("../services/auth.js");

module.exports = function auth(req, res, next) {
    const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.redirect("/");

    try {
        const decoded = jwt.verify(token, authService.jwtToken());
        req.requestingUser = decoded;
        next();
    } catch {
        res.status(401).redirect("/");
    }
};
