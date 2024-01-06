import { createLogger, transports, format } from 'winston';

const logLevel = process.env.NODE_ENV === 'production' ? 'verbose' : 'debug';

const consoleTransports = new transports.Console({
	level: logLevel,
	format: format.combine(
		format.errors({ stack: true }),
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.printf((info) => {
			if (info.stack)
				return `${info.timestamp} ${info.level}: ${info.message}\n${info.stack}`; // Custom format for error logs
			if (info.name === 'API_ERROR')
				return `${info.timestamp} ${info.level}: ${info.type}`; // Format for API Errors
			return `${info.timestamp} ${info.level}: ${info.message}`; // Default format for other logs
		})
	),
});

const winstonLogger = createLogger({
	transports: consoleTransports,
	exceptionHandlers: consoleTransports,
	exitOnError: false,
});

export const console = winstonLogger;
