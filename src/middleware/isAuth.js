const jwt = require("jsonwebtoken");
const authController = require("../controllers/authController");

module.exports = function auth(req, res, next) {
	const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
	if (!token) return next();

	try {
		const decoded = jwt.verify(token, authController.jwtToken());
		req.requestingUser = decoded;
		next();
	} catch {
		next();
	}
};
