import { verify } from 'jsonwebtoken';
import { AccessTokenError, AuthFailureError } from 'helpers/errors';

export const authentication =
	(publicKey) =>
		async (req, res, next) => {
			if (!req.headers['x-access-token'])
				throw new AuthFailureError('Unable to find access token.');
			if (!req.headers['x-refresh-token'])
				throw new AuthFailureError('Unable to find refresh token.');

			const payload = verify(
				req.headers['x-access-token'].toString(),
				publicKey
			);

			if (!payload || !payload.iss || !payload.aud || !payload.prm)
				throw new AccessTokenError('Invalid Access Token');

			res.locals.payload = payload;

			return next();
		};
