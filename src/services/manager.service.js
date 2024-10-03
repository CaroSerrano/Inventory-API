import Manager from "../models/manager.model.js";
import GenericQueries from "./gerenicQueries.js";
import { NotFoundError } from "../utils/errors.js";

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
    try {
      const result = await this.dao.models[Manager.model].findOne({
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
      let results = await this.dao.models[Manager.model].findAll({
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
      const [updatedCount] = await this.dao.models[Manager.model].update(data, {
        where: { id },
      });
      if (updatedCount > 0) {
        console.log("Manager updated succesfully");
        let result = await this.getByWithInclude({ id });
        return result;
      } else {
        throw new NotFoundError("Manager not found or no changes made");
      }
    } catch (error) {
      throw error;
    }
  };
}
