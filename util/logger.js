const { fs, path } = require('../serverConfig');
const winston = require('winston');
require('winston-daily-rotate-file');

const logDirectory = path.join(__dirname, '../logs');
if (!fs.existsSync(logDirectory)) {
    fs.mkdirSync(logDirectory, { recursive: true });
}

const isProduction = process.env.NODE_ENV === 'production';

const accessLogger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message} ${JSON.stringify(meta)}`;
        })
    ),
    transports: [
        ...(isProduction
            ? []
            : [new winston.transports.Console()]),
        new winston.transports.DailyRotateFile({
            filename: path.join(logDirectory, 'access-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '5m',
            maxFiles: '7d',
            level: 'info'
        })
    ]
});

const errorLogger = winston.createLogger({
    level: 'warn',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level.toUpperCase()}] ${message} ${JSON.stringify(meta)}`;
        })
    ),
    transports: [
        ...(isProduction
            ? []
            : [new winston.transports.Console()]),
        new winston.transports.DailyRotateFile({
            filename: path.join(logDirectory, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '5m',
            maxFiles: '14d',
            level: 'warn'
        })
    ]
});

module.exports = {
    accessLogger,
    errorLogger
};
