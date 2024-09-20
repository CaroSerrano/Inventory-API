import { userService } from "../../services/index.js";
import ClientError from "../errors.js";

export const checkDuplicateEmail = async (req, res, next) => {
  console.log("En checkDuplicateEmail");
  
  try {
    const user = await userService.getBy({ email: req.body.email });
    if (user) {
      throw new ClientError("Email already exist.");
    }
    console.log("Email válido");
    
    next();
  } catch (error) {   
    next(error);
  }
};
