import { Router } from 'express';
import users from './users/route';
import files from './files/route';
import authentication from 'auth/authentication';

const router = Router();

router.use('/users', users);

router.use('/files', authentication, files);

export default router;
