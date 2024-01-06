import { promisify } from 'util'
import { sign, verify, decode } from 'jsonwebtoken'
import { InternalError, BadTokenError, TokenExpiredError } from './errors'
import { logger } from './logger'

/*
 * issuer 		—  Software organization who issues the token.
 * subject 		—  Intended user of the token.
 * audience 	—  Basically identity of the intended recipient of the token.
 * expiresIn —  Expiration time after which the token will be invalid.
 * algorithm 	—  Encryption algorithm to be used to protect the token.
 */

export class JWT {
	async encode(payload: JwtPayload, privateKey: string): Promise<string> {
		if (!privateKey) throw new InternalError('Token generation failure')
		// @ts-ignore
		return promisify(sign)({ ...payload }, privateKey, { algorithm: 'RS256' })
	}

	/**
	 * This method checks the token and returns the decoded data when token is valid in all respect
	 */
	async validate(
		token: string,
		validations: ValidationParams,
		publicKey: string
	): Promise<JwtPayload> {
		try {
			// @ts-ignore
			return <JwtPayload>await promisify(verify)(token, publicKey, validations)
		} catch (error: any) {
			logger.debug(error)
			if (error && error.name === 'TokenExpiredError')
				throw new TokenExpiredError()
			throw new BadTokenError()
		}
	}

	/**
	 * This method checks the token and returns the decoded data even when the token is expired
	 */
	async decode(
		token: string,
		validations: ValidationParams,
		publicKey: string
	): Promise<JwtPayload> {
		try {
			// token is verified if it was encrypted by the private key
			// and if is still not expired then get the payload
			// @ts-ignore
			return <JwtPayload>await promisify(verify)(token, publicKey, validations)
		} catch (error: any) {
			logger.debug(error)
			if (error && error.name === 'TokenExpiredError') {
				// if the token has expired but was encryped by the private key
				// then decode it to get the payload
				// @ts-ignore
				return <JwtPayload>decode(token)
			} else {
				// throws error if the token has not been encrypted by the private key
				// or has not been issued for the user
				throw new BadTokenError()
			}
		}
	}

	/**
	 * This method checks the token and returns the decoded data
	 */
	decodeJWT(token: string): JwtPayload {
		try {
			// token is verified if it was encrypted by the private key
			// and if is still not expired then get the payload
			// @ts-ignore
			return <JwtPayload>decode(token)
		} catch (error: any) {
			logger.debug(error)
			throw new BadTokenError()
		}
	}
}

export class ValidationParams {
	issuer: string
	audience: string
	userId: string
	constructor(issuer: string, audience: string, userId: string) {
		this.issuer = issuer
		this.audience = audience
		this.userId = userId
	}
}

type Payload = {
	issuer: string
	audience: string
	userId: string
	username: string
	tokenId?: string
	param: string
	validity: number
}

const HOURS_IN_DAY = 24
const MINUTES_IN_HOUR = 60
const SECONDS_IN_MINUTES = 60

export class JwtPayload {
	aud: string
	iss: string
	userId: string
	username: string
	tokenId: string
	iat: number
	exp: number
	prm: string

	constructor({
		issuer,
		audience,
		userId,
		username,
		tokenId,
		param,
		validity,
	}: Payload) {
		this.iss = issuer
		this.aud = audience
		this.userId = userId
		this.username = username
		this.tokenId = tokenId || 'undefined'
		this.iat = Math.floor(Date.now() / 1000)
		this.exp =
			this.iat + validity * HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTES
		this.prm = param
	}
}
