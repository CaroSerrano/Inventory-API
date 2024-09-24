import { permissionService } from "../services/index.js";
import { response } from "../utils/response.js";
import ClientError from "../utils/errors.js";

const getPermissions = async (req, res, next) => {
  try {
    let results = await permissionService.getAll();
    if(!results) throw new ClientError("Error geting permissions.")
    response(res, 200, results);
  } catch (error) {
    next(error);
  }
};


const getPermissionById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const permission = await permissionService.getBy({ id: id });
    if(!permission) throw new ClientError("Error geting permission.");
    response(res, 200, permission);
  } catch (error) {
    next(error);
  }
};

const updatePermission = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const permission = await permissionService.update(id, data);
    if (!permission)
      throw new ClientError("Error updating permission");
    response(res, 200, permission);
  } catch (error) {
    next(error);
  }
};

const deletePermission = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await permissionService.delete(id);
    if (!result)
      throw new ClientError("Error deleting permission.");
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export default {
  getPermissions,
  getPermissionById,
  deletePermission,
  updatePermission,
};
