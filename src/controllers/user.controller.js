import {
  userService,
  roleService,
  employeeService,
  managerService,
  storeService,
} from "../services/index.js";
import { response } from "../utils/response.js";
import { ClientError, NotFoundError } from "../utils/errors.js";
import { createHash } from "../utils/authUtils.js";
import { Op } from "sequelize";

const showUsers = async (req, res, next) => {
  try {
    const { firstName, lastName, role } = req.query;
    
    let query = {};
    let results = [];
    let roles = await roleService.getAll();
    // Filters
    if (firstName) query.first_name = { [Op.like]: `%${firstName}%` };
    if (lastName) query.last_name = { [Op.like]: `%${lastName}%` };
    if (role) {
      if (role === "admin" || role === "basic_user")
        results = await userService.getAllWithInclude(query);
      if (role === "manager")
        results = await managerService.getAllWithInclude(query);
      if (role === "employee")
        results = await employeeService.getAllWithInclude(query);
      query["$role.name$"] = role;
    } else {
      const users = await userService.getAllWithInclude(query);
      const employees = await employeeService.getAllWithInclude(query);
      const managers = await managerService.getAllWithInclude(query);
      results = [...users, ...employees, ...managers];
    }
    if (!results) throw new NotFoundError("Error geting users.");
    // Verificar si la solicitud es AJAX
    if (req.xhr) {
      res.render("partials/users-list", { results, roles }); // Cambia por el nombre de la vista que solo contiene la lista de usuarios
    } else {
      res.render("users", {
        results,
        roles,
        query: req.query,
        nonce: res.locals.nonce,
      });
    }
  } catch (error) {
    console.error("Error at users controller: ", error.message);
    next(error);
  }
};

const getUsers = async (req, res, next) => {
  try {
    let results = await userService.getAllWithInclude();
    if (!results) throw new NotFoundError("Error geting users.");
    const users = results.map((user) => {
      const { password, ...safeData } = user;
      return safeData;
    });
    response(res, 200, users);
  } catch (error) {
    next(error);
  }
};

const showCreateUser = async (req, res, next) => {
  try {
    const roles = await roleService.getAll();
    const managers = await managerService.getAll();
    const stores = await storeService.getAll();  
    
    res.status(200).render("user-create", {roles, managers, stores});
  } catch (error) {
    console.error("error at showCreateUser: ", error.message);
    next(error)
  }
}

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
    const { password: _, ...userResponse } = result;
    response(res, 201, userResponse);
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await userService.getByWithInclude({ id: id });
    if (!user) throw new NotFoundError("Error geting user.");
    const { password: _, ...userResponse } = user;
    response(res, 200, userResponse);
  } catch (error) {
    next(error);
  }
};

const showUpdateUser = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const roles = await roleService.getAll();
    const managers = await managerService.getAll();
    const stores = await storeService.getAll();
    res.status(200).render("user-update", {userId, roles, managers, stores});
  } catch (error) {
    console.error("error at showUpdateUser: ", error.message);
    next(error)
  }
}

const updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await userService.updateWithInclude(data, id);
    if (!result) throw new NotFoundError("Error updating user.");
    const { password: _, ...userResponse } = result;
    response(res, 200, userResponse);
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await userService.delete(id);
    if (!result) throw new NotFoundError("Error deleting user.");
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export default {
  showUsers,
  showCreateUser,
  showUpdateUser,
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
};
