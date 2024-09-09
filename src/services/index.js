import Dao from "../models/Dao.js";
import UserService from "./user.service.js";
import ProductService from "./product.service.js";
import config from "../config/config.js";

// Crea una nueva instancia Dao utilizando la configuración de conexión a la base de datos.
const dao = new Dao(config.db);
dao.initialize();

// Crea una nueva instancia del servicio, pasando el DAO como parámetro.
export const userService = new UserService(dao);
export const productService = new ProductService(dao);
