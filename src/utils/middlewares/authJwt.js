import jwt from "jsonwebtoken";
import config from "../../config/config.js";
import ClientError from "../errors.js";

export const verifytoken = (req, res, next) => {
    let token = req.headers["x-access-token"];
    
    if (!token){
        throw new ClientError("Token required", 403);
    }

    jwt.verify(token, config.auth.secret, (err, decoded) => {
        if (err) {
            throw new ClientError("Not authorized", 401);
        }
        console.log(decoded);
        
        req.id = decoded.id;
        req.role_id = decoded.role_id;

        
    })
    next();
}