import User from "../models/user.model.js";
import ClientError from "../utils/errors.js";
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
    const result = await this.dao.models[User.model].findOne({
      where: options,
      include: this.include,
    });
    return result ? result : null;
  };

  getAllWithInclude = async (options) => {
    let results = await this.dao.models[User.model].findAll({
      where: options,
      include: this.include,
    });
    return results ? results : null;
  };

  updateWithInclude = async (data, id) => {
    const [updatedCount] = await this.dao.models[User.model].update(data, {
      where: { id },
    });
    if (updatedCount > 0) {
      console.log("User updated succesfully");
      let result = await this.getByWithInclude({ id });
      return result;
    } else {
      throw new ClientError("User not found or no changes made");
    }
  };
}
