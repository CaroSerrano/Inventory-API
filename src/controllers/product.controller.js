import { productService } from "../services/index.js";
import { response } from "../utils/response.js";
import ClientError from "../utils/errors.js";

const getProducts = async (req, res, next) => {
  try {
    let results = await productService.getAll();
    response(res, 200, results);
  } catch (error) {
    console.log(error);
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
    console.log(error);
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await productService.getBy({ id: id });
    response(res, 200, product);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    console.log("En controlador");
    
    const id = req.params.id;
    const { data } = req.body;
    const product = await productService.update(id, data);
    if (!product) throw new ClientError("El producto especificado no existe");
    response(res, 200, product);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await productService.delete(id);
    if (!result) throw new ClientError("El producto especificado no existe");
    res.status(204).end();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteManyProducts = async (req, res, next) => {
  try {
    const { filter } = req.body;
    const result = await productService.deleteMany(filter);
    if (!result)
      throw new ClientError(
        "No se encontraron productos con el filtro especificado"
      );
    res.status(204).end();
  } catch (error) {
    console.log(error);
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
