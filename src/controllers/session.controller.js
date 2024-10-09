import { sessionService } from "../services/index.js";
import {
  AuthorizationError,
  ClientError,
  NotFoundError,
} from "../utils/errors.js";
import { response } from "../utils/response.js";

const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { token, user } = await sessionService.signIn(email, password);
    res.cookie('token', token, { httpOnly: true, secure: true });
    response(res, 200, { token, user });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  const token = req.cookies.token;
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }
  if (!token) {
    throw new AuthorizationError("Token not provided");
  }
  try {
    const session = await sessionService.getBy({ token });
    if (!session) {
      throw new NotFoundError("Session not found or already logged out");
    }
    await sessionService.delete({ token });
    response(res, 200, "Successfully logged out");
  } catch (error) {
    next(error);
  }
};

export default {
  signIn,
  logout,
};
