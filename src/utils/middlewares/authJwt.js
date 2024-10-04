import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import {AuthorizationError} from "../errors.js";

export const verifytoken = (req, res, next) => {
  let token = req.cookies.token;

  if (!token) {
    throw new AuthorizationError("Token required", 403);
  }

  jwt.verify(token, config.auth.secret, (err, decoded) => {
    if (err) {
      throw new AuthorizationError("Not authorized", 401);
    }
    req.id = decoded.id;
    req.role_id = decoded.role_id;    
  });
  next();
};
