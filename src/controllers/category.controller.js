import { categoryService } from "../services/index.js";
import { response } from "../utils/response.js";
import { ClientError, NotFoundError } from "../utils/errors.js";
import { Op } from 'sequelize';

const getCategories = async (req, res, next) => {
  try {
    let results = await categoryService.getAll();
    if (!results) throw new NotFoundError("Error geting Categories.");
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
    if (!category) throw new NotFoundError("Error geting category.");
    response(res, 200, category);
  } catch (error) {
    next(error);
  }
};

const getCategoryByName = async (req, res, next) => {
  try {
    const name = req.params.name;
    const category = await categoryService.getBy({name: name });
    if (!category) throw new NotFoundError("Error geting category.");
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
    if (!category) throw new NotFoundError("Error updating category.");
    response(res, 200, category);
  } catch (error) {
    next(error);
  }
};

const deletecategory = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await categoryService.delete(id);
    if (!result) throw new NotFoundError("Error deleting category.");
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const showCategories = async (req, res, next) => {
  try {
    const role = req.role;
    const { name } = req.query;
    let query = {};
    // Filters
    if (name) query.name = { [Op.like]: `%${name}%` };
    
    const results = await categoryService.getAll(query);
    
    if (!results) throw new NotFoundError("Error geting categories.");

    // Verify if AJAX
    if (req.xhr) {
      res.render("partials/categories-list", { results }); // Changes to the name of the view that only contains the list of categories
    } else {
      res.render("categories", {
        results,
        query: req.query,
        nonce: res.locals.nonce,
        role
      });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  getCategories,
  insertCategory,
  getCategoryById,
  getCategoryByName,
  deletecategory,
  updateCategory,
  showCategories
};
