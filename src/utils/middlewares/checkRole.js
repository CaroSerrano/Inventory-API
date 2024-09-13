import { resErrors } from "../resErrors.js";
import ClientError from "../errors.js";

export const checkRole = (roles) => (req, res, next) => {
  const userRole = req.role_id; // Asume que JWT incluye el rol del usuario
  console.log("user role: ", userRole);
  
  if (!roles.includes(userRole)) {
    throw new ClientError("Access denied", 403);
  }
  next();
};
