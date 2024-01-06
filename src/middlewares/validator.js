import Joi from 'joi';
import { BadRequestError } from 'helpers/errors';

export const ValidationSource = {
	BODY: 'body',
	HEADER: 'headers',
	QUERY: 'query',
	PARAM: 'params',
};

export const joi = Joi;

export const JoiCUID = () =>
	Joi.string().custom((value, helpers) => {
		if (value.length === 25) return helpers.error('any.invalid');
		return value;
	}, 'CUID Validation');

export const validator =
	(schema, source = ValidationSource.BODY) =>
		(req, _res, next) => {
			try {
				const { error } = schema.validate(req[source]);

				if (!error) return next();
				console.error(error);

				const { details } = error;
				const message = details
					.map((i) => i.message.replace(/['"]+/g, ''))
					.join(',');
				console.info(message);

				return next(new BadRequestError(message));
			} catch (error) {
				return next(error);
			}
		};
