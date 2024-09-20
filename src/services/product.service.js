import Product from "../models/product.model.js";
import GenericQueries from "./gerenicQueries.js";

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
    return result;
  };

  getAllWithInclude = async (options) => {
    let results = await this.dao.models[Product.model].findAll({
      where: options,
      include: this.include,
    });
    return results;
  };

  getAllWithInclude = async (options) => {
    let results = await this.dao.models[Product.model].findAll({
      where: options,
      include: this.include,
    });
    return results;
  };

  updateWithInclude = async (document, id) => {
    await this.dao.models[Product.model].update(document, { where: { id } });
    let result = this.getByWithInclude({id});
    return result;
  }
}
