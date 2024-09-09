import Category from "../models/category.model.js";
import GenericQueries from "./gerenicQueries.js";

export default class CategoryService extends GenericQueries {
  constructor(dao) {
    super(dao, Category.model);
  }
}
