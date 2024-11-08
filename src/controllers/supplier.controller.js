import { supplierService } from "../services/index.js";
import { response } from "../utils/response.js";
import { ClientError, NotFoundError } from "../utils/errors.js";

const getSuppliers = async (req, res, next) => {
  try {
    let results = await supplierService.getAll();
    if (!results) throw new NotFoundError("Error geting stores.");
    response(res, 200, results);
  } catch (error) {
    next(error);
  }
};

const insertSupplier = async (req, res, next) => {
  try {
    const { name } = req.body;
    const result = await supplierService.insert({
      name,
    });
    if (!result) throw new ClientError("Check the inserted data.");
    response(res, 201, result);
  } catch (error) {
    next(error);
  }
};

const getSupplierById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const supplier = await supplierService.getBy({ id: id });
    if (!supplier) throw new NotFoundError("Error geting supplier.");
    response(res, 200, supplier);
  } catch (error) {
    next(error);
  }
};

const getSupplierByName = async (req, res, next) => {
  try {
    const name = req.params.name;
    const supplier = await supplierService.getBy({ name: name });
    if (!supplier) throw new NotFoundError("Error geting supplier.");
    response(res, 200, supplier);
  } catch (error) {
    next(error);
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const supplier = await supplierService.update(id, data);
    if (!supplier) throw new NotFoundError("Error updating supplier.");
    response(res, 200, supplier);
  } catch (error) {
    next(error);
  }
};

const deleteSupplier = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await supplierService.delete(id);
    if (!result) throw new NotFoundError("Error deleting supplier.");
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

const showSuppliers = async (req, res, next) => {
  try {
    const { name } = req.query;
    let query = {};
    // Filters
    if (name) query.name = { [Op.like]: `%${name}%` };

    const results = await supplierService.getAll(query);

    if (!results) throw new NotFoundError("Error geting suppliers.");

    // Verify if AJAX
    if (req.xhr) {
      res.render("partials/suppliers-list", { results }); // Changes to the name of the view that only contains the list of suppliers
    } else {
      res.render("suppliers", {
        results,
        query: req.query,
        nonce: res.locals.nonce,
      });
    }
  } catch (error) {
    next(error);
  }
};

export default {
  getSuppliers,
  insertSupplier,
  getSupplierById,
  getSupplierByName,
  deleteSupplier,
  updateSupplier,
  showSuppliers
};
