import Employee from "../models/employee.model.js";
import GenericQueries from "./gerenicQueries.js";
import ClientError from "../utils/errors.js";

export default class EmployeeService extends GenericQueries {
  constructor(dao) {
    super(dao, Employee.model);
    this.include = [
      {
        model: this.dao.models.Managers,
        as: "manager",
        attributes: ["first_name", "last_name"],
      },
    ];
  }

  getByWithInclude = async (options) => {
    const result = await this.dao.models[Employee.model].findOne({
      where: options,
      include: this.include,
    });
    return result? result : null;
  };

  getAllWithInclude = async (options) => {
    let results = await this.dao.models[Employee.model].findAll({
      where: options,
      include: this.include,
    });
    return results;
  };

  updateWithInclude = async (data, id) => {
    try {
      const [updatedCount] = await this.dao.models[Employee.model].update(data, {
        where: { id },
      });
      if (updatedCount > 0) {
        console.log("Employee updated succesfully");
        let result = await this.getByWithInclude({ id });
        return result;
      } else {
        throw new ClientError("Employee not found or no changes made");
      }
    } catch (error) {
      throw error
    }
  };
}
