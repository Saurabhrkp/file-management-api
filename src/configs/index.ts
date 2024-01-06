// Mapper for environment variables
export const environment = process.env.NODE_ENV
export const port = process.env.PORT

export const logDirectory = process.env.LOG_DIR

export const SIZES = {
	FILE_IN_MB: 10,
	IMAGE_IN_MB: 5,
	MEDIA_IN_MB: 150,
	BYTES_IN_KILOBYTE: 1024,
	KILOBYTES_IN_MEGABYTE: 1024,
	MEGABYTE_IN_GIGABYTE: 1024,
}

export const HOURS_IN_DAY = 24
export const MINUTES_IN_HOUR = 60
export const SECONDS_IN_MINUTES = 60
export const MILLISECONDS_IN_SECOND = 1000

export const sercretKeys = {
	privateKey: process.env.PRIVATE_KEY,
	publicKey: process.env.PUBLIC_KEY,
	apiKey: process.env.API_KEY,
}
