const getIndex = async (req, res, next) => {
	try {
		res.render("index", { user: req.user });
	} catch (err) {
		next(err);
	}
};

const getSignup = async (req, res, next) => {
	try {
		res.render("signup", { user: req.user });
	} catch (err) {
		next(err);
	}
};

module.exports = { getIndex, getSignup };
