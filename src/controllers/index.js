const crypto = require('../services/crypto');
const { randomBytes, createHash } = require("crypto");

const getIndex = async (req, res, next) => {
    try {
        res.render("index", { requestingUser: req.requestingUser });
    } catch (err) {
        next(err);
    }
};

const getLogin = async (req, res, next) => {
    try {
        const codeVerifier = randomBytes(32).toString('base64url');
        const state = randomBytes(16).toString('base64url');
        const codeChallenge = createHash('sha256').update(codeVerifier).digest('base64url');

        req.session.oauth = {
            state: state,
            code_verifier: codeVerifier
        };

        const params = new URLSearchParams({
            response_type: 'code',
            client_id: 'OpenMinerva-Web',
            redirect_uri: `${process.env.HOST_URL}/oauth/callback`,
            scope: 'openid',
            state: state,
            code_challenge: codeChallenge,
            code_challenge_method: 'S256'
        });

        // Redirect the user to the Authorization Server
        res.redirect(`${process.env.HOST_URL}/oauth/authorize?${params}`);
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
