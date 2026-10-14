const getAdmin = async (req, res, next) => {
	try {
		res.render("admin", { requestingUser: req.requestingUser, config: { general: {}, api: {} } });
	} catch (err) {
		next(err);
	}
};

module.exports = { getAdmin };
