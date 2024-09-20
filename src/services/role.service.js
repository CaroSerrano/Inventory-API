import Role from "../models/role.model.js";
import GenericQueries from "./gerenicQueries.js";

export default class RoleService extends GenericQueries {
  constructor(dao) {
    super(dao, Role.model);
    this.include = [
      {
        model: this.dao.models.Permissions,
        as: "permissions",
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
    ]
  }
  getAllWithInclude = async (options) => {
    const results = await this.dao.models[Role.model].findAll({
      where: options,
      include: this.include
    });
    return results? results : null;
  };
  getByWithInclude = async (options) => {
    const result = await this.dao.models[Role.model].findOne({
      where: options,
      include: this.include
    });
    return result? result : null;
  };
}
