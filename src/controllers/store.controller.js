import { storeService, employeeService } from "../services/index.js";
import { response } from "../utils/response.js";
import { ClientError, NotFoundError } from "../utils/errors.js";

const getStores = async (req, res, next) => {
  try {
    let results = await storeService.getAllWithInclude();
    if (!results) throw new NotFoundError("Error geting stores");
    response(res, 200, results);
  } catch (error) {
    next(error);
  }
};

const createStore = async (req, res, next) => {
  try {
    const { adress, manager_id } = req.body;

    const result = await storeService.insert({
      adress,
      manager_id,
    });
    if (!result) throw new ClientError("Check the inserted data");
    response(res, 201, result);
  } catch (error) {
    next(error);
  }
};

const getStoreById = async (req, res, next) => {
  const id = req.params.id;
  try {
    const store = await storeService.getByWithInclude({ id: id });
    if (!store) throw new NotFoundError("Store not found");
    response(res, 200, store);
  } catch (error) {
    next(error);
  }
};

const updateStore = async (req, res, next) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const result = await storeService.updateWithInclude(data, id);
    if (!result) throw new NotFoundError("Error updating store");
    response(res, 200, result);
  } catch (error) {
    next(error);
  }
};

const deleteStore = async (req, res, next) => {
  const id = req.params.id;
  try {
    const result = await storeService.delete(id);
    if (!result) throw new NotFoundError("Error deleting store");
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

export default {
  getStores,
  createStore,
  getStoreById,
  updateStore,
  deleteStore,
};
