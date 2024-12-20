import Employee from "../models/employee.model.js";
import GenericQueries from "./gerenicQueries.js";
import { NotFoundError } from "../utils/errors.js";

export default class EmployeeService extends GenericQueries {
  constructor(dao) {
    super(dao, Employee.model);
    this.include = [
      {
        model: this.dao.models.Managers,
        as: "manager",
        attributes: ["first_name", "last_name"],
      },
      {
        model: this.dao.models.Stores,
        as: "store",
        attributes: ["address"],
      }
    ];
  }

  getByWithInclude = async (options) => {
    try {
      const result = await this.dao.models[Employee.model].findOne({
        where: options,
        include: this.include,
      });
      return result ? result.dataValues : null;
    } catch (error) {
      throw error;
    }
  };

  getAllWithInclude = async (options) => {
    try {
      let results = await this.dao.models[Employee.model].findAll({
        where: options,
        include: this.include,
      });
      let mappedResults = results.map((result) => result.get({ plain: true }));
      return mappedResults ? mappedResults : null;
    } catch (error) {
      throw error;
    }
  };

  updateWithInclude = async (data, id) => {
    try {
      const [updatedCount] = await this.dao.models[Employee.model].update(
        data,
        {
          where: { id },
        }
      );
      if (updatedCount > 0) {
        console.log("Employee updated succesfully");
        let result = await this.getByWithInclude({ id });
        return result;
      } else {
        throw new NotFoundError("Employee not found or no changes made");
      }
    } catch (error) {
      throw error;
    }
  };
}
