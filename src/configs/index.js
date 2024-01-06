// Mapper for environment variables
export const environment = process.env.NODE_ENV;
export const port = process.env.PORT;

export const logDirectory = process.env.LOG_DIR;

export const SIZES = {
	FILE_IN_MB: 150,
	BYTES_IN_KILOBYTE: 1024,
	KILOBYTES_IN_MEGABYTE: 1024,
	MEGABYTE_IN_GIGABYTE: 1024,
};

export const HOURS_IN_DAY = 24;
export const MINUTES_IN_HOUR = 60;
export const SECONDS_IN_MINUTES = 60;
export const MILLISECONDS_IN_SECOND = 1000;

export const keys = {
	privateKey: process.env.PRIVATE_KEY || '',
	publicKey: process.env.PUBLIC_KEY || '',
};

export const tokenInfo = {
	accessTokenValidityDays: parseInt(
		process.env.ACCESS_TOKEN_VALIDITY_DAYS || '1'
	),
	refreshTokenValidityDays: parseInt(
		process.env.REFRESH_TOKEN_VALIDITY_DAYS || '15'
	),
	issuer: process.env.TOKEN_ISSUER || 'files_app',
	audience: process.env.TOKEN_AUDIENCE || 'files_app_user',
};
