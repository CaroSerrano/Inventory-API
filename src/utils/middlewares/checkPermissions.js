import ClientError from "../errors.js";
import { roleService } from "../../services/index.js";

export const checkPermissions = (permissions) => async (req, res, next) => {
  
  const userRole = req.role_id;
  
  const role = await roleService.getByWithInclude({ id: userRole });

  const rolePermissions = role.permissions.map((permission) => permission.name);

  if (!rolePermissions.includes(permissions)) {
    throw new ClientError(
      "You don't have enaugh permissions to access this resource."
    );
  }
  next();
};
