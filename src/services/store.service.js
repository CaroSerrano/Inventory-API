import Store from "../models/store.model.js";
import { employeeService } from "./index.js";
import ClientError from "../utils/errors.js";
import GenericQueries from "./gerenicQueries.js";

export default class StoreService extends GenericQueries {
  constructor(dao) {
    super(dao, Store.model);
    this.include = [
        {
          model: this.dao.models.Managers,
          as: "manager",
          attributes: ["first_name", "last_name"],
        },
      ];
  }

  getByWithInclude = async (options) => {
    const store = await this.dao.models[Store.model].findOne({
      where: options,
      include: this.include,
    });
    const number_of_employees = await employeeService.findAll({store_id: store.id}).length();
    const result = {
      store,
      number_of_employees: number_of_employees
    }
    return result? result : null;
  };

  getAllWithInclude = async (options) => {
    let results = await this.dao.models[Store.model].findAll({
      where: options,
      include: this.include,
    });
    return results;
  };

  updateWithInclude = async (data, id) => {
    try {
      const [updatedCount] = await this.dao.models[Store.model].update(data, {
        where: { id },
      });
      if (updatedCount > 0) {
        console.log("Store updated succesfully");
        let result = await this.getByWithInclude({ id });
        return result;
      } else {
        throw new ClientError("Store not found or no changes made");
      }
    } catch (error) {
      console.error("Error updating Store", error);
      throw error
    }
  };
}
