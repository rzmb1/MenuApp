const { format, createLogger, transports } = require('winston');
const { combine, timestamp, printf } = format;
const morgan = require('morgan');
const customFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} ${level}: ${message}`;
});
const logger = createLogger({
    level: "debug",
    format: combine(timestamp({
        format: 'YYYY-MM-DD hh:mm:ss.SSS',
    }), customFormat),
    transports: [new transports.Console()],
});
const morganMiddleware = morgan(
    ':method :url [[:status]] :res[content-length] - :response-time ms',
    {
        stream: {
            // Configure Morgan to use our custom logger with the http severity
            write: (message) => logger.http(message.trim()),
        },
    }
);
module.exports = { logger, morganMiddleware };