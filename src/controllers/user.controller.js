import { userService } from "../services/index.js";
import {response} from "../utils/response.js"
import ClientError from "../utils/errors.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config/config.js";

const getUsers = async (req, res, next) => {
  try {
    let results = await userService.getAll();
    response(res, 200, results);
  } catch (error) {
    console.log(error);
    next(error);    
  }
};

const signUp = async (req, res, next) => {  
  try {
    const { first_name, last_name, email, password, role_id } = req.body;
    console.log(req.body);
    
    const hashedPass = bcrypt.hashSync(password);
    const result = await userService.insert({
      first_name,
      last_name,
      email,
      password: hashedPass,
      role_id
    });
    if(!result) throw new ClientError("Check the inserted data")
    response(res, 201, result);
  } catch (error) {
    console.log(error);
    next(error)
  }
};

const signIn = async (req, res, next) => {
  console.log("en signin controlador");
  
  try {
    const email = req.body.email;
    console.log("email: ", email);
    
    const user = await userService.getBy({email})
    console.log("User: ",user);
    
    const password = req.body.password;
    console.log("password: ", password);
    
    if (!user){
      throw new ClientError ("User not found", 404);
    }
    let comparePasswords = bcrypt.compareSync(password, user.password);
    console.log("comparedPAsswords: ",comparePasswords);
    
    if(!comparePasswords){
      throw new ClientError ("Invalid password.", 401);
    }
    let token = jwt.sign({id: user.id, role_id: user.role_id}, config.auth.secret, {
      expiresIn: 86400 //24 horas
    })
    console.log("token: ",token);
    
    const savedUser = {
      id: user.id,
      name: user.first_name.concat(' ', user.last_name),
      email: user.email,
      role: user.role_id,
      accessToken: token
    }
    response(res, 201, savedUser)
  } catch (error) {
    next(error)
  }

}

const getUserById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await userService.getBy( {id: id} );
    response(res, 200, user);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { data } = req.body;
    const result = await userService.update(id, data);
    response(res, 200, result);
  } catch (error) {
    next(error)
  }
}

const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await userService.delete(id);
    if(!result) throw new ClientError("El usuario especificado no existe")
    res.status(204).end();
  } catch (error) {
    console.log(error);
    next(error); 
  }
}

export default {
  getUsers,
  signUp,
  signIn,
  getUserById,
  updateUser,
  deleteUser
};
