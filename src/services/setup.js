const logger = require("../services/logger");

let isSetup;

async function check() {
    if (isSetup !== undefined) return isSetup;

    const accounts = await require('../services/account').getAccount({ role: "admin" });
    if (accounts.length > 0) {
        isSetup = true
        return true
    }

    isSetup = false
    return false
}

async function middleware(req, res, next) {
    if (req.path === "/signup") {
        return next();
    }

    if (await check() == false) {
        logger.info("Server is not set up, redirecting to the setup page.");
        return res.redirect("/signup");
    }

    next();
}
function setState(state = true) {
    const newValue = Boolean(state);
    if (newValue == isSetup) return

    logger.debug(`Changing setup state to ${newValue}`);

    if (newValue == true) {
        logger.info(`Server is now set up!`);
    }

    isSetup = newValue;
}

module.exports = { check, middleware, setState };
