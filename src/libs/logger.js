const winston = require("winston");

const logger = winston.createLogger({
	level: "info",
	transports: [
		new winston.transports.File({
			filename: "data/logs/error.log",
			level: "error",
			format: winston.format.combine(winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston.format.json()),
		}),
		new winston.transports.File({
			filename: "data/logs/combined.log",
			format: winston.format.combine(winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), winston.format.json()),
		}),
	],
});

if (process.env.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({
			format: winston.format.combine(winston.format.colorize({ all: true }), winston.format.timestamp(), winston.format.simple()),
		}),
	);
}

module.exports = logger;
