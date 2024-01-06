import { tokenInfo } from 'configs/index';
import { encode } from 'core/jwt';
import { AuthFailureError, InternalError } from 'helpers/errors';
import { JwtPayload } from 'helpers/jwt';

const { issuer, audience, accessTokenValidityDays, refreshTokenValidityDays } =
	tokenInfo;

export const validateTokenData = async (
	payload,
	userId,
	username
) => {
	if (
		!payload ||
		!payload.iss ||
		!payload.userId ||
		!payload.aud ||
		!payload.prm ||
		payload.iss !== issuer ||
		payload.aud !== audience ||
		payload.username !== username ||
		payload.userId !== userId
	)
		throw new AuthFailureError('Invalid Access Token');
	return payload;
};

export const createTokens = async ({
	userId,
	username,
	tokenId,
	accessTokenKey,
	refreshTokenKey,
}) => {
	const accessToken = await encode(
		new JwtPayload({
			issuer,
			audience,
			userId,
			username,
			tokenId,
			param: accessTokenKey,
			validity: accessTokenValidityDays,
		})
	);

	if (!accessToken) throw new InternalError();

	const refreshToken = await encode(
		new JwtPayload({
			issuer,
			audience,
			userId,
			username,
			tokenId,
			param: refreshTokenKey,
			validity: refreshTokenValidityDays,
		})
	);

	if (!refreshToken) throw new InternalError();

	return {
		accessToken,
		refreshToken,
	};
};
