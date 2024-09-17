import Role from "../models/role.model.js";
import GenericQueries from "./gerenicQueries.js";

export default class RoleService extends GenericQueries {
  constructor(dao) {
    super(dao, Role.model);
  }
}
