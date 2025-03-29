import winston from 'winston';

// This creates a custom format for log messages
// It combines timestamp with a printf format that shows: timestamp [level]: message
const logFormat = winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} [${level}]: ${message}`;
    })
);

export const logger = winston.createLogger({
    // Sets log level based on environment:
    // - In production: only logs 'info' level and above (info, warn, error)
    // - In development: logs 'debug' level and above (debug, info, warn, error)
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',

    // Uses the custom format defined above
    format: logFormat,

    // Sets up three logging destinations:
    transports: [
        // 1. Console output - shows all logs of configured level and above
        new winston.transports.Console(),

        // 2. Error log file - only stores 'error' level logs
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),

        // 3. Combined log file - stores all logs of configured level and above
        new winston.transports.File({ filename: 'logs/combined.log' }),
    ],
});