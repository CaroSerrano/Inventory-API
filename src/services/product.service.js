import Product from "../models/product.model.js";
import GenericQueries from "./gerenicQueries.js";
import ClientError from "../utils/errors.js";

export default class ProductService extends GenericQueries {
  constructor(dao) {
    super(dao, Product.model);
    this.include = [
      {
        model: this.dao.models.Categories,
        as: "category",
        attributes: ["name"],
      },
      {
        model: this.dao.models.Suppliers,
        as: "supplier",
        attributes: ["name"],
      },
    ];
  }

  getByWithInclude = async (options) => {
    const result = await this.dao.models[Product.model].findOne({
      where: options,
      include: this.include,
    });
    return result ? result : null;
  };

  getAllWithInclude = async (options) => {
    let results = await this.dao.models[Product.model].findAll({
      where: options,
      include: this.include,
    });
    return results ? results : null;
  };

  updateWithInclude = async (document, id) => {
    const [updatedCount] = await this.dao.models[Product.model].update(
      document,
      { where: { id } }
    );
    if (updatedCount > 0) {
      console.log("Product updated succesfully");
      let result = await this.getByWithInclude({ id });
      return result;
    } else {
      throw new ClientError("Manager not found or no changes made");
    }
  };
}
