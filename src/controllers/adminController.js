const userService = require("../services/userService");
const timeService = require("../services/timeService");

const getIndex = async (req, res, next) => {
	try {
		if (req.requestingUser.role != "admin") {
			return res.redirect(`/`);
		}

		// User list
		let users = await userService.get();

		users.map((value, index, number) => {
			value.dateCreated = timeService.timeToDayMonthYear(value.dateCreated);
		});

		res.render("admin", { requestingUser: req.requestingUser, allUsers: users });
	} catch (err) {
		next(err);
	}
};

module.exports = { getIndex };
