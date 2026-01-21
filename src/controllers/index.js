const getIndex = async (req, res, next) => {
    try {
        res.render("index", { requestingUser: req.requestingUser });
    } catch (err) {
        next(err);
    }
};

const getLogin = async (req, res, next) => {
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

const getLogout = async (req, res, next) => {
    try {
        res.clearCookie('token').redirect('/');
    } catch (err) {
        next(err);
    }
};

module.exports = { getIndex, getSignup, getLogin, getLogout };
