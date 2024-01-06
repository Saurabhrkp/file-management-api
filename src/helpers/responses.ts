import { Response } from 'express'

// Helper code for the API consumer to understand the error and handle is accordingly
export const StatusCode = {
	SUCCESS: '10000',
	FAILURE: '10001',
	RETRY: '10002',
	INVALID_ACCESS_TOKEN: '10003',
}

export const ResponseStatus = {
	SUCCESS: 200,
	CREATED: 201,
	ACCEPTED: 202,
	BAD_REQUEST: 400,
	UNAUTHORIZED: 401,
	FORBIDDEN: 403,
	NOT_FOUND: 404,
	INTERNAL_ERROR: 500,
}

export const authFailureResponse = (
	res: Response,
	errors = [{ message: 'Authentication Failure' }]
) => {
	return res
		.status(ResponseStatus.UNAUTHORIZED)
		.json({ statusCode: StatusCode.FAILURE, errors })
}

export const notFoundResponse = (
	res: Response,
	errors = [{ message: 'Not Found' }]
) => {
	const url = res.req.originalUrl
	return res
		.status(ResponseStatus.NOT_FOUND)
		.json({ statusCode: StatusCode.FAILURE, errors, url })
}

export const forbiddenResponse = (
	res: Response,
	errors = [{ message: 'Forbidden' }]
) => {
	return res
		.status(ResponseStatus.FORBIDDEN)
		.json({ statusCode: StatusCode.FAILURE, errors })
}

export const badRequestResponse = (
	res: Response,
	errors = [{ message: 'Bad Parameters' }]
) => {
	return res
		.status(ResponseStatus.BAD_REQUEST)
		.json({ statusCode: StatusCode.FAILURE, errors })
}

export const internalErrorResponse = (
	res: Response,
	errors = [{ message: 'Internal Error' }]
) => {
	return res
		.status(ResponseStatus.INTERNAL_ERROR)
		.json({ statusCode: StatusCode.FAILURE, errors })
}

export const successMsgResponse = (res: Response, message = 'Success') => {
	return res
		.status(ResponseStatus.SUCCESS)
		.json({ statusCode: StatusCode.SUCCESS, message })
}

export const failureMsgResponse = (
	res: Response,
	errors = [{ message: 'Failed' }]
) => {
	return res
		.status(ResponseStatus.INTERNAL_ERROR)
		.json({ statusCode: StatusCode.FAILURE, errors })
}

export const successResponse = (
	res: Response,
	data: any,
	message = 'Success'
) => {
	return res
		.status(ResponseStatus.SUCCESS)
		.json({ statusCode: StatusCode.SUCCESS, message, data })
}

export const paginatedResponse = (
	res: Response,
	data: any,
	pagination: object,
	message = 'Success'
) => {
	return res
		.status(ResponseStatus.SUCCESS)
		.json({ statusCode: StatusCode.SUCCESS, message, data, pagination })
}

export const customResponse = (
	res: Response,
	data: any,
	message = 'Success'
) => {
	return res
		.status(ResponseStatus.SUCCESS)
		.json({ statusCode: StatusCode.SUCCESS, message, ...data })
}

export const createdResponse = (
	res: Response,
	data: any,
	message = 'Created'
) => {
	return res
		.status(ResponseStatus.CREATED)
		.json({ statusCode: StatusCode.SUCCESS, message, data })
}

export const accessTokenErrorResponse = (
	res: Response,
	errors = [{ message: 'Access token invalid' }]
) => {
	res.setHeader('instruction', 'refresh_token')
	return res
		.status(ResponseStatus.UNAUTHORIZED)
		.json({ statusCode: StatusCode.INVALID_ACCESS_TOKEN, errors })
}

export const tokenRefreshResponse = (
	res: Response,
	accessToken: string,
	refreshToken: string,
	message = 'Access token'
) => {
	return res
		.status(ResponseStatus.SUCCESS)
		.json({
			statusCode: StatusCode.SUCCESS,
			message,
			accessToken,
			refreshToken,
		})
}
