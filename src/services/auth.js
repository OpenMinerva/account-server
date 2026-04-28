const cryptoLib = require("../services/crypto");
const accountService = require('../services/account');

async function authLogin({ username, password }) {
    try {
        const targetAccount = await accountService.getAccount({ username }, { includePassword: true });

        if (!targetAccount) {
            return { ok: false, message: "No account found." };
        }

        const passwordMatches = await cryptoLib.comparePassword(password, targetAccount.password);

        if (passwordMatches.ok == true && passwordMatches.response == true) {
            // We do not need the password beyond verifying it.
            let responseAccount = targetAccount;
            delete responseAccount.password;

            return { ok: true, response: responseAccount }
        }

        return { ok: false, ...passwordMatches };
    }
    catch (e) {
        return false
    }
}

module.exports = { authLogin }