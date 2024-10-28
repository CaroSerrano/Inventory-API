import { storeService, employeeService, managerService } from "../services/index.js";
import { response } from "../utils/response.js";
import { ClientError, NotFoundError } from "../utils/errors.js";
import { Op } from "sequelize";

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
    const { address, manager_id } = req.body;

    const result = await storeService.insert({
      address,
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

const showStores = async (req, res, next) => {
  try {
    const { address, manager_id } = req.query;
    let query = {};
    // Filters
    if (address) query.address = { [Op.like]: `%${address}%` };
    if (manager_id) query.manager_id = { [Op.like]: `%${manager_id}%` };

    const results = await storeService.getAllWithInclude(query);
    const managers = await managerService.getAllWithInclude();

    if (!results) throw new NotFoundError("Error geting stores.");

    // Verificar si la solicitud es AJAX
    if (req.xhr) {
      res.render("partials/stores-list", { results }); // Changes to the name of the view that only contains the list of stores
    } else {
      res.render("stores", {
        results,
        managers,
        query: req.query,
        nonce: res.locals.nonce,
      });
    }
  } catch (error) {
    console.error("Error at stores controller: ", error.message);
    next(error);
  }
};

export default {
  getStores,
  createStore,
  getStoreById,
  updateStore,
  deleteStore,
  showStores,
};
