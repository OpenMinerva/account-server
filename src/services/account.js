const db = require("../db/index.js");

const getAccount = async (identifiers, opts) => await db.getAccount(identifiers, opts);
const createAccount = async (data) => await db.createAccount(data);
// const updateAccount = async (data) => await db.updateAccount(data);
// const deleteAccount = async (data) => await db.createAccount(data);

module.exports = { getAccount, createAccount }