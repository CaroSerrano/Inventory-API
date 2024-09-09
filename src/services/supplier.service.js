import Supplier from "../models/supplier.model.js";
import GenericQueries from "./gerenicQueries.js";

export default class SupplierService extends GenericQueries {
  constructor(dao) {
    super(dao, Supplier.model);
  }
}
