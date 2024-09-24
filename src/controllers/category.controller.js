import { categoryService } from "../services/index.js";
import { response } from "../utils/response.js";
import ClientError from "../utils/errors.js";

const getCategories = async (req, res, next) => {
  try {
    let results = await categoryService.getAll();
    if(!results) throw new ClientError("Error geting Categories.")
    response(res, 200, results);
  } catch (error) {
    next(error);
  }
};

const insertCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const result = await categoryService.insert({
      name,
    });
    if (!result) throw new ClientError("Check the inserted data");
    response(res, 201, result);
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const category = await categoryService.getBy({ id: id });
    if(!category) throw new ClientError("Error geting category.")
    response(res, 200, category);
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const category = await categoryService.update(id, data);
    if (!category)
      throw new ClientError("Error updating category.");
    response(res, 200, category);
  } catch (error) {
    next(error);
  }
};

const deletecategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await categoryService.delete(id);
    if (!result)
      throw new ClientError("Error deleting category.");
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export default {
  getCategories,
  insertCategory,
  getCategoryById,
  deletecategory,
  updateCategory,
};
