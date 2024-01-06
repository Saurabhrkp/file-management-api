import { keys } from 'configs/index';
import { JWT } from 'helpers/jwt';

const { publicKey, privateKey } = keys;
const jwt = new JWT();

export const decode = async (token, validations) => {
	return await jwt.decode(token, validations, publicKey);
};

export const encode = async (payload) => {
	return await jwt.encode(payload, privateKey);
};

export const validate = async (
	token,
	validations
) => {
	return await jwt.validate(token, validations, publicKey);
};
