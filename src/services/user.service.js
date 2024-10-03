import User from "../models/user.model.js";
import { NotFoundError } from "../utils/errors.js";
import GenericQueries from "./gerenicQueries.js";

export default class UserService extends GenericQueries {
  constructor(dao) {
    super(dao, User.model);
    this.include = [
      {
        model: this.dao.models.Roles,
        as: "role",
        attributes: ["name"],
      },
    ];
  }

  getByWithInclude = async (options) => {
    try {
      const result = await this.dao.models[User.model].findOne({
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
      let results = await this.dao.models[User.model].findAll({
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
      const [updatedCount] = await this.dao.models[User.model].update(data, {
        where: { id },
      });
      if (updatedCount > 0) {
        console.log("User updated succesfully");
        let result = await this.getByWithInclude({ id });
        return result;
      } else {
        throw new NotFoundError("User not found or no changes made");
      }
    } catch (error) {
      throw error;
    }
  };
}
