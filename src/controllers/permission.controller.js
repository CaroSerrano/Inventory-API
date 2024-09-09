import { permissionService } from "../services/index.js";
import { response } from "../utils/response.js";
import ClientError from "../utils/errors.js";

const getPermissions = async (req, res, next) => {
  try {
    let results = await permissionService.getAll();
    response(res, 200, results);
  } catch (error) {
    console.log(error);
    next(error);
  }
};


const getPermissionById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const permission = await permissionService.getBy({ id: id });
    response(res, 200, permission);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updatePermission = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { data } = req.body;
    const permission = await permissionService.update(id, data);
    if (!permission)
      throw new ClientError("The specified permission does not exists.");
    response(res, 200, permission);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deletePermission = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await permissionService.delete(id);
    if (!result)
      throw new ClientError("The specified permission does not exists.");
    res.status(204).end();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default {
  getPermissions,
  getPermissionById,
  deletePermission,
  updatePermission,
};
