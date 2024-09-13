import { Sequelize, Op } from "sequelize";
import User from "./user.model.js";
import Product from "./product.model.js";
import Role from "./role.model.js";
import Permission from "./permissions.model.js";
import Category from "./category.model.js";
import Supplier from "./supplier.model.js";
import setupAssociations from "./associations.js";

export default class Dao {
  // Primero, creamos el constructor que manejará la conexión a la base de datos.
  constructor(sequelizeConfig) {
    // Crear una instancia de Sequelize para la conexión
    this.sequelize = new Sequelize(
      sequelizeConfig.DB_NAME,
      sequelizeConfig.DB_USER,
      sequelizeConfig.DB_PASS,
      {
        host: sequelizeConfig.DB_HOST,
        dialect: sequelizeConfig.dialect,
        logging: false,
      }
    );

    this.sequelize
      .authenticate()
      .then(() => {
        console.log("Connection established succesfully.");
      })
      .catch((error) => {
        console.error("Error connecting to database:", error);
        process.exit(1);
      });

    // Definir los modelos utilizando Sequelize
    this.models = {
      [User.model]: User.initModel(this.sequelize),
      [Product.model]: Product.initModel(this.sequelize),
      [Role.model]: Role.initModel(this.sequelize),
      [Permission.model]: Permission.initModel(this.sequelize),
      [Category.model]: Category.initModel(this.sequelize),
      [Supplier.model]: Supplier.initModel(this.sequelize),
    };
    // Establecer las asociaciones entre los modelos
    setupAssociations(this.models);
  }
  async initialize() {    
    await this.syncModels(); // Sincroniza los modelos al inicializar el DAO
    await this.initPermissions();
    await this.initRoles();
  }
  // Método para inicializar permisos
  async initPermissions() {
    const initialPermissions = [
      { name: "read:roles" },
      { name: "create:users" },
      { name: "update:users" },
      { name: "delete:users" },
      { name: "read:users" },
      { name: "create:products" },
      { name: "update:products" },
      { name: "delete:products" },
      { name: "read:products" },
      { name: "create:categories" },
      { name: "update:categories" },
      { name: "delete:categories" },
      { name: "read:categories" },
      { name: "create:suppliers" },
      { name: "update:suppliers" },
      { name: "delete:suppliers" },
      { name: "read:suppliers" },
    ];

    try {
      // Verificar si ya existen permisos
      const existingPermissions = await this.models.Permissions.findAll();
      if (existingPermissions.length === 0) {
        // Si no hay permisos, crear los permisos iniciales
        await this.models.Permissions.bulkCreate(initialPermissions);
        console.log("Permissions initialized successfully.");
      } else {
        console.log("Permissions already exist.");
      }
    } catch (error) {
      console.error("Error initializing permissions:", error);
    }
  }

  async initRoles() {
    try {
      const existingRoles = await this.models.Roles.findAll();
      if (existingRoles.length === 0) {
        const adminPermissions = await this.models.Permissions.findAll();
        const admin = await this.models.Roles.create({ name: "admin" });

        const managerRegex = "\\b(products|suppliers|categories)\\b";
        const managerPermissions = await this.models.Permissions.findAll({
          where: { name: { [Op.regexp]: managerRegex } },
        });
        const manager = await this.models.Roles.create({ name: "manager" });

        const employeeRegex = "^(create|update|read):products$";
        const employeePermissions = await this.models.Permissions.findAll({
          where: { name: { [Op.regexp]: employeeRegex } },
        });
        const employee = await this.models.Roles.create({ name: "employee" });

        const userRegex = "^read:products$";
        const userPermissions = await this.models.Permissions.findAll({
          where: { name: { [Op.regexp]: userRegex } },
        });
        const basic_user = await this.models.Roles.create({
          name: "basic_user",
        });

        await admin.addPermissions(adminPermissions);
        await manager.addPermissions(managerPermissions);
        await employee.addPermissions(employeePermissions);
        await basic_user.addPermissions(userPermissions);
        console.log("Roles initialized successfully.");
      } else {
        console.log("Roles already exist.");
      }
    } catch (error) {
      console.error("Error initializing roles: ", error);
    }
  }
  // Función para sincronizar todos los modelos con la base de datos
  async syncModels() {
    await this.sequelize.sync({ alter: false }); // `force: true` recrea las tablas
  }

  // Método para encontrar un único documento que coincida con los criterios especificados.
  findOne = async (options, entity) => {
    if (!this.models[entity])
      throw new Error(`Entity ${entity} not in dao schemas`);
    let result;
    try {
      if (entity === "Products") {
        result = await this.models[entity].findOne({
          where: options,
          include: [
            {
              model: this.models.Categories,
              as: "category",
              attributes: ["name"],
            },
            {
              model: this.models.Suppliers,
              as: "supplier",
              attributes: ["name"],
            },
          ],
        });
      } else if (entity === "Users") {
        result = await this.models[entity].findOne({
          where: options,
          include: [
            {
              model: this.models.Roles,
              as: "role",
              attributes: ["name"],
            },
          ],
        });
      } else {
        result = await this.models[entity].findOne({ where: options });
      }
      return result ? result.get({ plain: true }) : null; // Convierte el resultado en un objeto plano
    } catch (error) {
      console.error("Error finding document:", error);
      return null;
    }
  };

  // Método para obtener todos los documentos que coincidan con los criterios especificados.
  getAll = async (options, entity) => {
    if (!this.models[entity])
      throw new Error(`Entity ${entity} not in dao schemas`);
    let results;
    try {
      if (entity === "Products") {
        results = await this.models[entity].findAll({
          where: options,
          include: [
            {
              model: this.models.Categories,
              as: "category",
              attributes: ["name"],
            },
            {
              model: this.models.Suppliers,
              as: "supplier",
              attributes: ["name"],
            },
          ],
        });
      } else if (entity === "Users") {
        results = await this.models[entity].findAll({
          where: options,
          include: [
            {
              model: this.models.Roles,
              as: "role",
              attributes: ["name"],
            },
          ],
        });
      } else {
        results = await this.models[entity].findAll({ where: options });
      }
      return results.map((result) => result.get({ plain: true }));
    } catch (error) {
      console.error("Error finding documents:", error);
      return [];
    }
  };

  // Método para agregar un nuevo documento a la base de datos.
  save = async (document, entity) => {
    if (!this.models[entity]) throw new Error("Entity not found in models");
    try {
      let result = await this.models[entity].create(document);
      return result//.get({ plain: true });
    } catch (error) {
      console.error("Error saving document:", error);
      return null;
    }
  };

  //Función para insertar varios documentos a la vez.
  saveMany = async (documents, entity) => {
    if (!this.models[entity]) throw new Error("Entity not found in models");
    try {
      let results = await this.models[entity].bulkCreate(documents);
      return results.map((result) => result.get({ plain: true }));
    } catch (error) {
      console.error("Error saving documents:", error);
      return null;
    }
  };

  // Método para actualizar un documento existente en la base de datos.
  update = async (document, entity) => {
    if (!this.models[entity])
      throw new Error(`Entity ${entity} not in dao schemas`);
    let id = document.id;
    delete document.id;
    let result;
    try {
      // `update` en Sequelize actualiza registros, pero no devuelve el registro actualizado directamente
      await this.models[entity].update(document, { where: { id } });
      if (entity === "Products") {
        result = await this.models[entity].findByPk({
          id,
          include: [
            {
              model: this.models.Categories,
              as: "category",
              attributes: ["name"],
            },
            {
              model: this.models.Suppliers,
              as: "supplier",
              attributes: ["name"],
            },
          ],
        });
      } else if (entity === "Users") {
        result = await this.models[entity].findByPk({
          id,
          include: [
            {
              model: this.models.Roles,
              as: "role",
              attributes: ["name"],
            },
          ],
        });
      } else {
        result = await this.models[entity].findByPk(id);
      }
      return result ? result.get({ plain: true }) : null;
    } catch (error) {
      console.error("Error updating document:", error);
      return null;
    }
  };

  // Método para eliminar un documento de la base de datos.
  delete = async (id, entity) => {
    if (!this.models[entity])
      throw new Error(`Entity ${entity} not in dao schemas`);
    try {
      let result = await this.models[entity].destroy({ where: { id } });
      return result ? { message: "Deleted successfully" } : null;
    } catch (error) {
      console.error("Error deleting document:", error);
      return null;
    }
  };

  //Eliminar múltiples documentos
  deleteMany = async (filter, entity) => {
    if (!this.models[entity])
      throw new Error(`Entity ${entity} not in dao schemas`);
    try {
      let result = await this.models[entity].destroy({ where: filter });
      return result ? result : null;
    } catch (error) {
      console.error("Error deleting documents:", error);
      return null;
    }
  };
}
