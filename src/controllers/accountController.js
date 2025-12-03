const userService = require("../services/userService");
const timeService = require("../services/timeService");

const getIndex = async (req, res, next) => {
	try {
		const targetUser = await userService.get({ id: req.params.id });
		targetUser.dateCreated = timeService.timeToDayMonthYear(targetUser.dateCreated);
		res.render("account", { targetUser, requestingUser: req.requestingUser });
	} catch (err) {
		next(err);
	}
};

const getEdit = async (req, res, next) => {
	try {
		const targetUser = await userService.get({ id: req.params.id });
		targetUser.dateCreated = timeService.timeToDayMonthYear(targetUser.dateCreated);
		res.render("accountEdit", { targetUser, requestingUser: req.requestingUser });
	} catch (err) {
		next(err);
	}
};

module.exports = { getIndex, getEdit };
