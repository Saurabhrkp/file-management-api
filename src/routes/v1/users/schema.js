import Joi from 'joi';

export default {
  signUp: Joi.object().keys({
    username: Joi.string().required().min(6),
    email: Joi.string().email().required(),
    password: Joi.string().alphanum().required().min(6)
  }),
  signIn: Joi.object().keys({
    username: Joi.string().required().min(6),
    password: Joi.string().required().min(6)
  }),
  refreshToken: Joi.object().keys({
    'x-refresh-token': Joi.string().required().min(1),
  }).unknown(true)
};