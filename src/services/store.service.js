import Store from "../models/store.model.js";
import { employeeService } from "./index.js";
import { NotFoundError } from "../utils/errors.js";
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
    try {
      const store = await this.dao.models[Store.model].findOne({
        where: options,
        include: this.include,
      });

      if (store) {
        const cleanStore = store.dataValues;
        const store_employees = await employeeService.getAll({
          store_id: cleanStore.id,
        });
        let number_of_employees;
        if (store_employees) {
          number_of_employees = store_employees.length;
        } else {
          number_of_employees = 0;
        }
        cleanStore.number_of_employees = number_of_employees;
        return cleanStore ? cleanStore : null;
      }
    } catch (error) {
      throw error;
    }
  };

  getAllWithInclude = async (options) => {
    try {
      let results = await this.dao.models[Store.model].findAll({
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
      const [updatedCount] = await this.dao.models[Store.model].update(data, {
        where: { id },
      });
      if (updatedCount > 0) {
        console.log("Store updated succesfully");
        let result = await this.getByWithInclude({ id });
        return result;
      } else {
        throw new NotFoundError("Store not found or no changes made");
      }
    } catch (error) {
      console.error("Error updating Store", error);
      throw error;
    }
  };
}
