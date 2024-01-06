import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import fs from 'fs';
import 'express-async-errors';

import { ApiError, InternalError, NotFoundError } from 'helpers/errors';
import { errorLogger } from 'middlewares/apiLogger';

import { environment } from 'configs/index';
import indexRoutes from 'routes/index';

// Creating express app
const app = express();

/**
 * Express App Global configurations
 */
// Disable x-powered-by in headers
app.disable('x-powered-by');
// Enable CORS
app.use(cors());
// Parse incoming requests with urlencoded payloads
app.use(express.urlencoded({ extended: true }));
// Text parser for Forms
app.use(express.text({ limit: '5mb', type: 'text/csv' }));
// JSON parser for Forms
app.use(express.json({ limit: '5mb', type: 'application/json' }));

/** Security Compression. */
if (environment === 'production') {
	/** Protects app from some well-known web vulnerabilities. */
	app.use(helmet());
	/** Compress all routes. */
	app.use(compression());
	/** Remove Compression if using Nginx */
}

// Routes
app.get('/', (_req, res) => res.send('Health OK'));
app.use('/api', indexRoutes);

// catch 404 and forward to error handler
app.use((_req, _res, next) =>
	next(new NotFoundError())
);

// Logging Error requests
app.use(errorLogger);

// Middleware Error Handler
app.use(async (err, req, res, _next) => {
	const files = req.files;
	if (files?.file !== undefined && files?.file.length > 0 && files?.file[0].path) {
		try {
			await fs.promises.unlink(files.file[0].path);
		} catch (error) {
			console.log(error);
		}
	}
	if (err instanceof ApiError) return ApiError.handle(err, res);
	if (environment === 'production')
		return ApiError.handle(new InternalError(), res);
	return res.status(500).json({ errors: [{ message: err.message }] });
});

module.exports = app;