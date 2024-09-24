import { managerService } from "../services/index.js";
import { response } from "../utils/response.js";
import ClientError from "../utils/errors.js";
import { createHash } from "../utils/authUtils.js";

const getManagers = async (req, res, next) => {
  try {
    let results = await managerService.getAllWithInclude();
    if (!results) throw new ClientError("Error geting managers.");
    const users = results.map(({ dataValues }) => {
      const { password, ...userResponse } = dataValues;
      return userResponse;
    });
    response(res, 200, users);
  } catch (error) {
    next(error);
  }
};

const createManager = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      role_id,
      management_level,
      hire_date,
    } = req.body;

    const hashedPass = await createHash(password);
    const result = await managerService.insert({
      first_name,
      last_name,
      email,
      password: hashedPass,
      role_id,
      management_level,
      hire_date,
    });
    if (!result) throw new ClientError("Check the inserted data.");
    const { password: _, ...userResponse } = result.dataValues;
    response(res, 201, userResponse);
  } catch (error) {
    next(error);
  }
};

const getManagerById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await managerService.getByWithInclude({ id: id });
    if (!user) throw new ClientError("Error geting manager.");
    response(res, 200, user);
  } catch (error) {
    next(error);
  }
};

const updateManager = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await managerService.updateWithInclude(data, id);
    if (!result) throw new ClientError("Error updating Manager.");
    response(res, 200, result);
  } catch (error) {
    next(error);
  }
};

const deleteManager = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await managerService.delete(id);
    if (!result) throw new ClientError("Error deleting Manager.");
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export default {
  getManagers,
  createManager,
  getManagerById,
  updateManager,
  deleteManager,
};
