import { employeeService } from "../services/index.js";
import { response } from "../utils/response.js";
import ClientError from "../utils/errors.js";
import { createHash } from "../utils/authUtils.js";

const getEmployees = async (req, res, next) => {
  try {
    let results = await employeeService.getAllWithInclude();
    if (!results) throw new ClientError("Error geting employees.");
    const users = results.map(({ dataValues }) => {
      const { password, ...userResponse } = dataValues;
      return userResponse;
    });
    response(res, 200, users);
  } catch (error) {
    next(error);
  }
};

const createEmployee = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      role_id,
      position,
      hire_date,
      shift_schedule,
      salary,
      manager_id,
      store_id
    } = req.body;

    const hashedPass = await createHash(password);
    const result = await employeeService.insert({
      first_name,
      last_name,
      email,
      password: hashedPass,
      role_id,
      position,
      hire_date,
      shift_schedule,
      salary,
      manager_id,
      store_id
    });
    if (!result) throw new ClientError("Check the inserted data.");
    const { password: _, ...userResponse } = result.dataValues;
    response(res, 201, userResponse);
  } catch (error) {
    next(error);
  }
};

const getEmployeeById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const user = await employeeService.getByWithInclude({ id: id });
    if (!user) throw new ClientError("Error geting employee.");
    response(res, 200, user);
  } catch (error) {
    next(error);
  }
};

const updateEmployee = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await employeeService.updateWithInclude(data, id);
    if (!result) throw new ClientError("Error updating employee.");
    response(res, 200, result);
  } catch (error) {
    next(error);
  }
};

const deleteEmployee = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await employeeService.delete(id);
    if (!result) throw new ClientError("Error deleting employee.");
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export default {
  getEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
};
