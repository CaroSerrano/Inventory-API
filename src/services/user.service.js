import User from "../models/user.model.js";
import GenericQueries from "./gerenicQueries.js";

export default class UserService extends GenericQueries {
  constructor(dao) {
    super(dao, User.model);
  }
}
