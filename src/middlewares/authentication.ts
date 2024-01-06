import { NextFunction, Request, Response } from 'express'
import { verify } from 'jsonwebtoken'
import { AccessTokenError, AuthFailureError } from 'helpers/errors'
import { JwtPayload } from 'helpers/jwt'

declare global {
	namespace Express {
		interface Request {
			headers?: any
			payload?: JwtPayload
		}
	}
}

export const authentication =
	(publicKey: string) =>
	async (req: Request, res: Response, next: NextFunction) => {
		if (!req.headers['x-access-token'])
			throw new AuthFailureError('Unable to find access token.')
		if (!req.headers['x-refresh-token'])
			throw new AuthFailureError('Unable to find refresh token.')

		const payload = verify(
			req.headers['x-access-token'].toString(),
			publicKey
		) as JwtPayload

		if (!payload || !payload.iss || !payload.aud || !payload.prm)
			throw new AccessTokenError('Invalid Access Token')

		res.locals.payload = payload

		return next()
	}
