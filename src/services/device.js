const db = require("../db/index.js");

const getDevice = async (identifiers, opts) => await db.getDevice(identifiers, opts);
const createDevice = async (identifiers, opts) => await db.createDevice(identifiers, opts);

module.exports = { getDevice, createDevice }