import { sessionService } from "../services/index.js";
import ClientError from "../utils/errors.js";
import { response } from "../utils/response.js";

const signIn = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { token, user } = await sessionService.signIn(email, password);
    response(res, 200, { token, user });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  const token = req.headers.authorization;
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }
  console.log(token);
  if (!token) {
    throw new ClientError("Token not provided", 401);
  }
  try {
    const session = await sessionService.getBy({ token });
    if (!session) {
      throw new ClientError("Session not found or already logged out", 404);
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
