import { userService } from "../services/index.js";
import { response } from "../utils/response.js";
import ClientError from "../utils/errors.js";
import { createHash } from "../utils/authUtils.js";

const getUsers = async (req, res, next) => {
  try {
    let results = await userService.getAllWithInclude();
    if (!results) throw new ClientError("Error geting users");
    const users = results.map(({ dataValues }) => {
      const { password, ...userResponse } = dataValues;
      return userResponse;
    });
    response(res, 200, users);
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, role_id } = req.body;

    const hashedPass = await createHash(password);
    const result = await userService.insert({
      first_name,
      last_name,
      email,
      password: hashedPass,
      role_id,
    });
    if (!result) throw new ClientError("Check the inserted data");
    const { password: _, ...userResponse } = result.dataValues;
    response(res, 201, userResponse);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await userService.getByWithInclude({ id: id });
    if (!user) throw new ClientError("User not found");
    response(res, 200, user);
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await userService.updateWithInclude(data, id);
    if (!result) throw new ClientError("Error updating user");
    response(res, 200, result);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await userService.delete(id);
    if (!result) throw new ClientError("Error deleting user");
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export default {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
