import Dao from "../models/Dao.js";
import UserService from "./user.service.js";
import ProductService from "./product.service.js";
import CategoryService from "./category.service.js";
import SupplierService from "./supplier.service.js";
import PermissionService from "./permission.service.js";
import RoleService from "./role.service.js";
import SessionService from "./session.service.js";
import EmployeeService from "./employee.service.js";
import ManagerService from "./manager.service.js";
import StoreService from "./store.service.js"
import config from "../config/config.js";

// Crea una nueva instancia Dao utilizando la configuración de conexión a la base de datos.
const dao = new Dao(config.db);
dao.initialize();
export const models = dao.models;

// Crea una nueva instancia del servicio, pasando el DAO como parámetro.
export const userService = new UserService(dao);
export const productService = new ProductService(dao);
export const categoryService = new CategoryService(dao);
export const supplierService = new SupplierService(dao);
export const permissionService = new PermissionService(dao);
export const roleService = new RoleService(dao);
export const sessionService = new SessionService(dao);
export const employeeService = new EmployeeService(dao);
export const managerService = new ManagerService(dao);
export const storeService = new StoreService(dao);