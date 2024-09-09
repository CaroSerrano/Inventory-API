import { supplierService } from "../services/index.js";
import { response } from "../utils/response.js";
import ClientError from "../utils/errors.js";

const getSuppliers = async (req, res, next) => {
  try {
    let results = await supplierService.getAll();
    response(res, 200, results);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const insertSupplier = async (req, res, next) => {
  try {
    const { name } = req.body;
    const result = await supplierService.insert({
      name,
    });
    if (!result) throw new ClientError("Check the inserted data");
    response(res, 201, result);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const getSupplierById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const supplier = await supplierService.getBy({ id: id });
    response(res, 200, supplier);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updateSupplier = async (req, res, next) => {
  try {
    const id = req.params.id;
    const { data } = req.body;
    const supplier = await supplierService.update(id, data);
    if (!supplier)
      throw new ClientError("The specified supplier does not exists.");
    response(res, 200, supplier);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const deleteSupplier = async (req, res, next) => {
  try {
    const id = req.params.id;
    const result = await supplierService.delete(id);
    if (!result)
      throw new ClientError("The specified supplier does not exists.");
    res.status(204).end();
  } catch (error) {
    console.log(error);
    next(error);
  }
};

export default {
  getSuppliers,
  insertSupplier,
  getSupplierById,
  deleteSupplier,
  updateSupplier,
};