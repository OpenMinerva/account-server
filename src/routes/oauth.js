const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/isAuth");
const requireAuth = require("../middleware/requireAuth");

const oauthController = require("../controllers/oauth");

router.get('/callback', async (req, res) => {
    // FIXME:
    // This is ran when we are wanting to exchange the authorization code for a access token.
    // This is not meant to be used in production and needs to be removed after testing!

    // FIXME:
    // Figure out how to do this cookie setting thing without making a request through the web.
    // Is this normal?

    const COOKIE_SETTINGS = {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000,
    };

    const { code } = req.query;

    if (!code) {
        return res.send("No code found in URL. Did authorization succeed?");
    }

    try {
        // Simulate the game client sending a exchange request.
        const response = await fetch(`${process.env.HOST_URL}/oauth/token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: `${process.env.HOST_URL}/callback`,
                client_id: 'OpenMinerva Game Client',
                // FIXME: Hardcoded code_verifier
                code_verifier: "_6LBUC-6o_gecwIKGx7Rs4Ni4FdhJnjC1DbnY08tr5ySjF8AbGscfHPokHUz7Xpj"
            }),
        });

        const tokens = await response.json();
        res.cookie("token", tokens, COOKIE_SETTINGS)
        res.json(tokens);

    } catch (error) {
        console.error(error);
        res.status(500).send("Error exchanging code for tokens");
    }
});

module.exports = router