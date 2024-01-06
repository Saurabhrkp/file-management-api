import { promisify } from 'util';
import { sign, verify, decode } from 'jsonwebtoken';
import { InternalError, BadTokenError, TokenExpiredError } from './errors';

/*
 * issuer 		—  Software organization who issues the token.
 * subject 		—  Intended user of the token.
 * audience 	—  Basically identity of the intended recipient of the token.
 * expiresIn —  Expiration time after which the token will be invalid.
 * algorithm 	—  Encryption algorithm to be used to protect the token.
 */

export class JWT {
	async encode(payload, privateKey) {
		if (!privateKey) throw new InternalError('Token generation failure');
		return promisify(sign)({ ...payload }, privateKey, { algorithm: 'RS256' });
	}

	/**
	 * This method checks the token and returns the decoded data when token is valid in all respect
	 */
	async validate(
		token,
		validations,
		publicKey
	) {
		try {
			return await promisify(verify)(token, publicKey, validations);
		} catch (error) {
			console.debug(error);
			if (error && error.name === 'TokenExpiredError')
				throw new TokenExpiredError();
			throw new BadTokenError();
		}
	}

	/**
	 * This method checks the token and returns the decoded data even when the token is expired
	 */
	async decode(
		token,
		validations,
		publicKey
	) {
		try {
			// token is verified if it was encrypted by the private key
			// and if is still not expired then get the payload
			return await promisify(verify)(token, publicKey, validations);
		} catch (error) {
			console.debug(error);
			if (error && error.name === 'TokenExpiredError') {
				// if the token has expired but was encryped by the private key
				// then decode it to get the payload
				return decode(token);
			} else {
				// throws error if the token has not been encrypted by the private key
				// or has not been issued for the user
				throw new BadTokenError();
			}
		}
	}

	/**
	 * This method checks the token and returns the decoded data
	 */
	decodeJWT(token) {
		try {
			// token is verified if it was encrypted by the private key
			// and if is still not expired then get the payload
			return decode(token);
		} catch (error) {
			console.debug(error);
			throw new BadTokenError();
		}
	}
}

export class ValidationParams {
	issuer;
	audience;
	userId;
	constructor(issuer, audience, userId) {
		this.issuer = issuer;
		this.audience = audience;
		this.userId = userId;
	}
}

const HOURS_IN_DAY = 24;
const MINUTES_IN_HOUR = 60;
const SECONDS_IN_MINUTES = 60;

export class JwtPayload {
	aud;
	iss;
	userId;
	username;
	tokenId;
	iat;
	exp;
	prm;

	constructor({
		issuer,
		audience,
		userId,
		username,
		tokenId,
		param,
		validity,
	}) {
		this.iss = issuer;
		this.aud = audience;
		this.userId = userId;
		this.username = username;
		this.tokenId = tokenId || 'undefined';
		this.iat = Math.floor(Date.now() / 1000);
		this.exp =
			this.iat + validity * HOURS_IN_DAY * MINUTES_IN_HOUR * SECONDS_IN_MINUTES;
		this.prm = param;
	}
}
