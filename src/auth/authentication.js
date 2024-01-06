import { Router } from 'express'
import { keys } from 'configs/index'
import db from 'services/prisma'
import { authentication } from 'middlewares/authentication'
import { AccessTokenError, AuthFailureError } from 'helpers/errors'
import { TokenExpiredError } from 'jsonwebtoken'

const router = Router()

export default router.use(
	authentication(keys.publicKey),
	async (_req, res, next) => {
		try {
			const payload = res.locals.payload
			const userId = payload.userId
			const tokenId = payload.tokenId

			const user = await db.user.findFirst({ where: { id: userId } })
			if (!user) throw new AuthFailureError('user not registered or not active')

			res.locals.user = user
			res.locals.userId = userId
			res.locals.username = user.username
			res.locals.tokenId = tokenId

			return next()
		} catch (error) {
			console.error(error)
			console.info('Error while authentication.')
			if (error instanceof TokenExpiredError)
				throw new AccessTokenError(error.message)
			throw error
		}
	}
)
