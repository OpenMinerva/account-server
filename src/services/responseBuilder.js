/* --- License
 * File: /src/middleware/isAuth.js
 * Project: account-server
 * Created Date: 28 April 2026
 * Copyright (c) 2026 OpenMinerva
 * License: MIT License
 * Authors: Armored Dragon
 * --- License */

class ResponseBuilder {
	constructor() {
		this._response = { ok: false, error: null, data: null };
	}
	/**
	 * Success response builder
	 * @param {*} data - The successful result/data to return
	 * @returns {object}
	 */
	static success(data) {
		let response = { ...this._response };

		response.ok = true;
		response.data = data;

		return response;
	}

	/**
	 * Error response builder
	 * @param {String} error - The error message.
	 * @returns {object}
	 */
	static error(error) {
		let response = { ...this._response };

		response.ok = false;
		response.error = error;

		return response;
	}
}

module.exports = ResponseBuilder;
