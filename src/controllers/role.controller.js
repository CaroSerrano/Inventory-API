import { roleService } from "../services/index.js";
import { response } from "../utils/response.js";
import ClientError from "../utils/errors.js";

const getRoles = async (req, res, next) => {
  try {
    let results = await roleService.getAll();
    response(res, 200, results);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getRoleById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const role = await roleService.getBy({ id: id });
    if (!role) throw new ClientError("The specified role does not exists.");
    response(res, 200, role);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const createRole = async (req, res, next) => {
  try {
    const {data} = req.body;
    const result = await roleService.insert(data);
    response(res, 201, result);
  } catch (error) {
    console.log(error);
    
    next(error);
  }
}

const updateRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { data } = req.body;
    const role = await roleService.update(id, data);
    if (!role) throw new ClientError("The specified role does not exists.");
    response(res, 200, role);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteRole = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await roleService.delete(id);
    if (!result)
      throw new ClientError("The specified role does not exists.");
    res.status(204).end();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default {
  getRoles,
  getRoleById,
  createRole,
  deleteRole,
  updateRole,
};
