
const accountService = require('../services/account');

module.exports = async function auth(req, res, next) {
    const token = req.cookies?.token || req.headers["authorization"]?.split(" ")[1];
    if (!token) return res.redirect("/");

    try {
        // TODO: Request includes header to tell which OAuth endpoint to target?
        // TODO: Detect response accept type, and return json where required.
        // TODO: Error (catch) checking.
        const introspectionResponse = await fetch(`${process.env.HOST_URL}/oauth/token/introspection`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',

            },
            body: new URLSearchParams({
                client_id: "OpenMinerva-Game-Client",
                token: token,
            })
        });

        const database_response = await introspectionResponse.json();

        if (database_response.active) {
            const target_user = await accountService.getAccount({ id: database_response.sub });
            req.requestingUser = target_user;
            next();
            return;
        }

        res.status(401).redirect("/");
    } catch (e) {
        res.status(401).redirect("/");
    }
};
