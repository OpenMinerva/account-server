const db = require("../db/index.js");

// const getDevice = async (identifiers, opts) => await db.getDevice(identifiers, opts);
const createDevice = async (identifiers) => await db.createDevice(identifiers);
// const updateDevice = async (data) => await db.updateDevice(data);
// const deleteDevice = async (data) => await db.deleteDevice(data);

module.exports = { createDevice }