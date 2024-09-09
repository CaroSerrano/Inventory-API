import { userService } from "../services/index.js";
import {response} from "../utils/response.js"
import ClientError from "../utils/errors.js"

const getUsers = async (req, res, next) => {
  try {
    let results = await userService.getAll();
    response(res, 200, results);
  } catch (error) {
    console.log(error);
    next(error);    
  }

};

const insertUser = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    const result = await userService.insert({
      first_name,
      last_name,
      email,
      password,
    });
    if(!result) throw new ClientError("Check the inserted data")
    response(res, 201, result);
  } catch (error) {
    console.log(error);
    next(error)
  }
};

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
  insertUser,
  getUserById,
  deleteUser
};
