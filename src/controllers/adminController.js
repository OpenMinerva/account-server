const userService = require("../services/userService");
const timeService = require("../services/timeService");

const getIndex = async (req, res, next) => {
	try {
		// User list
		const users = await userService.get();

		res.render("admin", { requestingUser: req.requestingUser, allUsers: users });
	} catch (err) {
		next(err);
	}
};

module.exports = { getIndex };
