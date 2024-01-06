import { Router } from 'express';
import authentication from 'auth/authentication';
import { validator, ValidationSource } from 'middlewares/validator';
import AccessController from './controller';
import schema from './schema';

const router = Router();

router.post('/sign-up', validator(schema.signUp), AccessController.signUp);

router.post('/sign-in', validator(schema.signIn), AccessController.signIn);

router.put('/refresh-token', authentication, validator(schema.refreshToken, ValidationSource.HEADER), AccessController.refreshToken);

export default router;