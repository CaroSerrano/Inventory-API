import Product from "../models/product.model.js";
import GenericQueries from "./gerenicQueries.js";

export default class ProductService extends GenericQueries {
  constructor(dao) {
    super(dao, Product.model);
  }
}
