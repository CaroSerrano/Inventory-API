import { AuthorizationError } from "../errors.js";
import { roleService } from "../../services/index.js";

export const checkPermissions = (permissions) => async (req, res, next) => {
  try {
    const userRole = req.role_id;

    const role = await roleService.getByWithInclude({ id: userRole });

    const rolePermissions = role.permissions.map(
      (permission) => permission.name
    );

    if (!rolePermissions.includes(permissions)) {
      throw new AuthorizationError(
        "You don't have enough permissions to access this resource."
      );
    }
    next();
  } catch (error) {
    console.error(error.message);
    next(error);
  }
};
