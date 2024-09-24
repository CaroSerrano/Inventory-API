import Manager from "../models/manager.model.js";
import GenericQueries from "./gerenicQueries.js";
import ClientError from "../utils/errors.js";
import { employeeService } from "./index.js";

export default class ManagerService extends GenericQueries {
  constructor(dao) {
    super(dao, Manager.model);
    this.include = [
      {
        model: this.dao.models.Employees,
        as: "employees",
        attributes: ["first_name", "last_name"],
      },
    ];
  }

  getByWithInclude = async (options) => {
    const manager = await this.dao.models[Manager.model].findOne({
      where: options,
      include: this.include,
    });
    const number_of_employees = await employeeService.findAll({manager_id: manager.id}).length();
    const result = {
      manager,
      number_of_employees: number_of_employees
    }
    return result? result : null;
  };

  getAllWithInclude = async (options) => {
    let results = await this.dao.models[Manager.model].findAll({
      where: options,
      include: this.include,
    });
    return results;
  };

  updateWithInclude = async (data, id) => {
    try {
      const [updatedCount] = await this.dao.models[Manager.model].update(data, {
        where: { id },
      });
      if (updatedCount > 0) {
        console.log("Manager updated succesfully");
        let result = await this.getByWithInclude({ id });
        return result;
      } else {
        throw new ClientError("Manager not found or no changes made");
      }
    } catch (error) {
      throw error
    }
  };
}
