import _ from 'lodash';
import cuid from 'cuid';
import bcrypt from 'bcrypt';
import { validate } from 'core/jwt';
import { tokenInfo } from 'configs/index';
import db from 'services/prisma';
import { createTokens, validateTokenData } from 'auth/authUtils';
import { AuthFailureError, BadRequestError } from 'helpers/errors';
import { ValidationParams } from 'helpers/jwt';

class AccessService {
  async signUp(body) {
    const { username, email, password } = body;

    const exisitingUser = await db.user.findFirst({ where: { username: { equals: username } } });
    if (exisitingUser) throw new BadRequestError('Username already taken');

    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, passwordSalt);

    const user = await db.user.create({ data: { username, email, passwordHash } });
    return { user: _.pick(user, ['email', 'username']), message: 'Please login to upload file.' };
  }

  async signIn(body) {
    const { username, password } = body;

    const user = await db.user.findFirst({ where: { username: { equals: username }, active: true } });
    if (!user) throw new BadRequestError('User not registered');

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) throw new AuthFailureError('Authentication failure');

    const accessTokenKey = cuid();
    const refreshTokenKey = cuid();

    const tokens = await createTokens({ userId: user.id, username: user.username, email: user.email, accessTokenKey, refreshTokenKey });
    return { user: _.pick(user, ['id', 'email', 'username']), tokens };
  }

  async refreshToken(refreshToken, locals) {
    const userId = locals.userId;
    const username = locals.username;
    const payload = locals.payload;

    await validateTokenData(
      await validate(refreshToken, new ValidationParams(tokenInfo.issuer, tokenInfo.audience, userId)),
      userId, username
    );

    const accessTokenKey = cuid();
    const refreshTokenKey = cuid();

    const tokens = await createTokens({ userId, username, email: payload.email, accessTokenKey, refreshTokenKey });
    return tokens;
  }
}

export default new AccessService();