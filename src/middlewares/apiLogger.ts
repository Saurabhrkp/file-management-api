import { transports, format } from 'winston'
import expressWinston from 'express-winston'

export const apiLogger = expressWinston.logger({
	transports: [new transports.Console()],
	format: format.combine(
		format.errors({ stack: true }),
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.printf(({ level, message, timestamp, stack }) => {
			if (stack) return `${timestamp} ${level}: ${message}\n${stack}` // Custom format for error logs
			return `${timestamp} ${level}: ${message}` // Default format for other logs
		})
	),
	meta: false,
	expressFormat: true,
	colorize: false,
	statusLevels: true,
	skip: (req, _res) => req.method === 'OPTIONS',
})

export const errorLogger = expressWinston.errorLogger({
	transports: [new transports.Console()],
	format: format.combine(
		format.errors({ stack: true }),
		format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
		format.printf(({ level, message, timestamp, meta }) => {
			const error = JSON.stringify(meta?.error)
			const username = JSON.stringify(meta?.username)
			console.error({ timestamp, level, message, meta })
			return `${timestamp} ${level}: ${message}, username: ${username}, error: ${error}`
		})
	),
	meta: true,
	requestField: null,
	blacklistedMetaFields: ['process', 'stack', 'trace', 'os', 'message'],
	dynamicMeta: (req, res, _err) => {
		return {
			url: req.url,
			body: req.body,
			username: res.locals?.payload?.username,
			tokenId: res.locals?.payload?.tokenId,
		}
	},
	skip: (req, _res) => req.method === 'OPTIONS',
})
