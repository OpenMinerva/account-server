const getIndex = async (req, res, next) => {
	try {
		res.render("login", { requestingUser: req.requestingUser });
	} catch (err) {
		next(err);
	}
};

const getSignup = async (req, res, next) => {
	try {
		res.render("signup", { requestingUser: req.requestingUser });
	} catch (err) {
		next(err);
	}
};

module.exports = { getIndex, getSignup };
