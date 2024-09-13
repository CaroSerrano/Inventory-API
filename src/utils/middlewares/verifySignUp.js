import { userService } from "../../services/index.js";
import ClientError from "../errors.js";

export const checkDuplicateEmail = async (req, res, next) => {
    console.log("en checkDuplicateEmail");
    
    try {
        const user = await userService.getBy({email: req.body.email})
        if(user) {
            throw new ClientError("Email already exist.")
        }
        next()
    } catch (error) {
        next(error);
    }
};