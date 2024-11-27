import {
  productService,
  categoryService,
  supplierService,
} from "../services/index.js";
import { response } from "../utils/response.js";
import { ClientError, NotFoundError } from "../utils/errors.js";
import { Op } from "sequelize";

const showProducts = async (req, res, next) => {
  try {
    const { name, category, supplier, order } = req.query;
    let query = {};
    // Filters
    if (name) query.name = { [Op.like]: `%${name}%` };
    if (category) query["$category.name$"] = category;
    if (supplier) query["$supplier.name$"] = supplier;

    // Orders
    let orderBy = [];
    if (order === "price-asc") orderBy.push(["unit_price", "ASC"]);
    else if (order === "price-desc") orderBy.push(["unit_price", "DESC"]);
    else if (order === "date-asc") orderBy.push(["created_at", "ASC"]);
    else if (order === "date-desc") orderBy.push(["created_at", "DESC"]);
    else if (order === "alpha") orderBy.push(["name", "ASC"]);
    else orderBy = undefined;

    let categories = await categoryService.getAll();
    let suppliers = await supplierService.getAll();

    let results = await productService.getAllWithIncludeOrder(query, orderBy);

    if (!results) throw new NotFoundError("Error geting products.");
    // Verificar si la solicitud es AJAX
    if (req.xhr) {
      res.render("partials/product-list", { results }); // Cambia por el nombre de la vista que solo contiene la lista de productos
    } else {
      res.render("product-admin", {
        results,
        categories,
        suppliers,
        query: req.query,
        nonce: res.locals.nonce,
      });
    }
  } catch (error) {
    console.error("Error at product controller: ", error.message);
    next(error);
  }
};

const showCreateProduct = async (req, res, next) => {
  try {
    const categories = await categoryService.getAll();
    const suppliers = await supplierService.getAll();
    res.status(200).render("product-create", { categories, suppliers });
  } catch (error) {
    console.error("error at showCreateProduct: ", error.message);
    next(error);
  }
};

const showUpdateProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;
    const product = await productService.getBy({id: productId});
    const productSupplier = product.supplier_id;
    const productCategory = product.category_id;
    const categories = await categoryService.getAll();
    const suppliers = await supplierService.getAll();
    res
      .status(200)
      .render("product-update", { productId, productCategory, productSupplier, categories, suppliers });
  } catch (error) {
    console.error("error at showUpdateProduct: ", error.message);
    next(error);
  }
};

const getProducts = async (req, res, next) => {
  try {
    let results = await productService.getAllWithInclude();
    if (!results) throw new NotFoundError("Error geting products.");
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
    if (!result) throw new ClientError("Check the inserted data.");
    response(res, 201, result);
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const product = await productService.getByWithInclude({ id: id });
    if (!product) throw new NotFoundError("Error geting product.");
    response(res, 200, product);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const product = await productService.updateWithInclude(data, id);
    if (!product) throw new NotFoundError("Error updating product.");
    response(res, 200, product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await productService.delete(id);
    if (!result) throw new NotFoundError("Error deleting product.");
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const deleteManyProducts = async (req, res, next) => {
  try {
    const filter = req.body;
    const result = await productService.deleteMany(filter);
    if (!result) throw new NotFoundError("Error deleting products.");
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export default {
  getProducts,
  showProducts,
  insertProduct,
  showCreateProduct,
  showUpdateProduct,
  getProductById,
  deleteProduct,
  deleteManyProducts,
  updateProduct,
};
