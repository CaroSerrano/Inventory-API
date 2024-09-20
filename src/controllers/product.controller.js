import { productService } from "../services/index.js";
import { response } from "../utils/response.js";
import ClientError from "../utils/errors.js";

const getProducts = async (req, res, next) => {
  try {
    let results = await productService.getAllWithInclude();
    if (!results) throw new ClientError("Error geting products");
    response(res, 200, results);
  } catch (error) {
    next(error);
  }
};

const insertProduct = async (req, res, next) => {
  try {
    const {
      name,
      description,
      unit_price,
      units_in_stock,
      category_id,
      supplier_id,
    } = req.body;
    const result = await productService.insert({
      name,
      description,
      unit_price,
      units_in_stock,
      category_id,
      supplier_id,
    });
    if (!result) throw new ClientError("Check the inserted data");
    response(res, 201, result);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await productService.getByWithInclude({ id: id });
    if (!product) throw new ClientError("Error geting product");
    response(res, 200, product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    console.log("En controlador");

    const id = req.params.id;
    const { data } = req.body;
    const product = await productService.updateWithInclude(data, id);
    if (!product) throw new ClientError("Error updating product");
    response(res, 200, product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await productService.delete(id);
    if (!result) throw new ClientError("Error deleting product");
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const deleteManyProducts = async (req, res, next) => {
  try {
    const { filter } = req.body;
    const result = await productService.deleteMany(filter);
    if (!result) throw new ClientError("Error deleting products");
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export default {
  getProducts,
  insertProduct,
  getProductById,
  deleteProduct,
  deleteManyProducts,
  updateProduct,
};
