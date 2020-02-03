const winston = require("winston");
const { combine, timestamp, printf } = winston.format;

class Logger {
  constructor() {
    const myFormat = printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    });

    this.logger = winston.createLogger({
      level: "debug",
      format: combine(timestamp(), myFormat),
      transports: [new winston.transports.Console()]
    });
  }

  info(message) {
    this.logger.info(message);
  }

  debug(message) {
    this.logger.debug(message);
  }

  warn(message) {
    this.logger.warn(message);
  }

  error(message) {
    this.logger.error(message);
  }
}

module.exports = Logger;
