import Permission from "../models/permissions.model.js";
import GenericQueries from "./gerenicQueries.js";

export default class PermissionService extends GenericQueries {
  constructor(dao) {
    super(dao, Permission.model);
  }
}
