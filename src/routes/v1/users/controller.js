import { createdResponse, successResponse, tokenRefreshResponse } from 'helpers/responses';
import AccessService from './service';

class AccessController {
  async signUp(req, res) {
    const { username, email, password } = req.body;
    const { user, tokens } = await AccessService.signUp({ username, email, password });
    return createdResponse(res, { user, tokens }, 'Created account.');
  }

  async signIn(req, res) {
    const { username, password } = req.body;
    const { user, tokens } = await AccessService.signIn({ username, password });
    return successResponse(res, { user, tokens }, 'Logged in.');
  }

  async refreshToken(req, res) {
    const userId = res.locals.userId;
    const username = res.locals.username;
    const payload = res.locals.payload;
    const refreshToken = req.headers['x-refresh-token'].toString();
    const tokens = await AccessService.refreshToken(refreshToken, { userId, username, payload });
    return tokenRefreshResponse(res, tokens, 'Token Issued');
  }
};

export default new AccessController();