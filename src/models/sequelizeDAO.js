import { Sequelize } from "sequelize";
import User from "./user.model.js";
import Product from "./product.model.js";
import Role from "./role.model.js";
import Permission from "./permissions.model.js";
import Category from "./category.model.js";
import Supplier from "./supplier.model.js";
import Session from "./sessions.model.js";
import Employee from "./employee.model.js";
import Manager from "./manager.model.js";
import Store from "./store.model.js";
import setupAssociations from "./associations.js";
import initialSetup from "../utils/initialSetup.js";
import { NotFoundError, ValidationError } from "../utils/errors.js";

export default class sequelizeDAO {
  constructor(sequelizeConfig) {
    // Create sequelize instance to manage database connection
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

    this.#authenticate();
    this.#initializeModels();
  }
  //DB connection
  async #authenticate() {
    try {
      await this.sequelize.authenticate();
      console.log("Connection established successfully.");
    } catch (error) {
      console.error("Error connecting to the database:", error);
      process.exit(1); // Finish process if connection failed
    }
  }
  // Define models
  #initializeModels() {
    this.models = {
      [User.model]: User.initModel(this.sequelize),
      [Product.model]: Product.initModel(this.sequelize),
      [Role.model]: Role.initModel(this.sequelize),
      [Permission.model]: Permission.initModel(this.sequelize),
      [Category.model]: Category.initModel(this.sequelize),
      [Supplier.model]: Supplier.initModel(this.sequelize),
      [Session.model]: Session.initModel(this.sequelize),
      [Employee.model]: Employee.initModel(this.sequelize),
      [Manager.model]: Manager.initModel(this.sequelize),
      [Store.model]: Store.initModel(this.sequelize),
    };
  }

  initialize = async () => {
    setupAssociations(this.models); // Setup associations between models
    await this.syncModels(); // Synchronize models
    await initialSetup.initPermissions(this.models); //load permissions in DB
    await initialSetup.initRoles(this.models); //load roles in DB
  };
  // Function to synchronize models
  syncModels = async () => {
    await this.sequelize.sync({ force: false }); // `force: true` recrea las tablas
  };

  // Find a single record that matches specified criteria.
  findOne = async (options, entity) => {
    if (!this.models[entity])
      throw new ValidationError(`Entity ${entity} not found in models`);

    try {
      let result = await this.models[entity].findOne({ where: options });
      if (result) return result.dataValues;
      return null;
    } catch (error) {
      console.error("Error finding document:", error);
      throw error;
    }
  };

  // Find all records that matches specified criteria.
  getAll = async (options, entity) => {
    if (!this.models[entity])
      throw new ValidationError(`Entity ${entity} not found in models`);
    try {
      let results = await this.models[entity].findAll({ where: options });
      if (results) {
        const mappedResults = results.map((result) =>
          result.get({ plain: true })
        );
        return mappedResults;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error finding documents:", error);
      throw error;
    }
  };

  // Add a new record
  save = async (document, entity) => {
    if (!this.models[entity])
      throw new ValidationError(`Entity ${entity} not found in models`);
    try {
      let result = await this.models[entity].create(document);
      if (result) return result.dataValues;
      return null;
    } catch (error) {
      console.error("Error saving document:", error);
      throw error;
    }
  };

  //Add multiple records
  saveMany = async (documents, entity) => {
    if (!this.models[entity])
      throw new ValidationError(`Entity ${entity} not found in models`);
    const transaction = await this.sequelize.transaction();
    try {
      const results = await this.models[entity].bulkCreate(documents, {
        transaction,
      });
      await transaction.commit();
      if (results) {
        const mappedResults = results.map((result) =>
          result.get({ plain: true })
        );
        return mappedResults;
      } else {
        return [];
      }
    } catch (error) {
      await transaction.rollback();
      console.error(error);
      throw error;
    }
  };

  // Update an existing record
  update = async (document, entity) => {
    if (!this.models[entity])
      throw new ValidationError(`Entity ${entity} not found in models`);
    let id = document.id;
    delete document.id;

    try {
      // `update` in Sequelize updates a record, but doesn´t return it updated.
      await this.models[entity].update(document, { where: { id } });
      let result = await this.models[entity].findByPk(id);
      if (result) return result.dataValues;
      return null;
    } catch (error) {
      console.error("Error updating document:", error);
      throw error;
    }
  };

  // Delete a single record
  delete = async (id, entity) => {
    if (!this.models[entity])
      throw new ValidationError(`Entity ${entity} not found in models`);
    try {
      let result = await this.models[entity].destroy({ where: { id } });
      if (result) return { message: "Deleted successfully" };
      return { message: "Error deleting document" };
    } catch (error) {
      console.error("Error deleting document:", error);
      throw error;
    }
  };

  //Delete multiple records
  deleteMany = async (filter, entity) => {
    if (!this.models[entity])
      throw new ValidationError(`Entity ${entity} not found in models`);
    const transaction = await this.sequelize.transaction();
    try {
      let result = await this.models[entity].destroy(
        { where: filter },
        { transaction }
      );
      await transaction.commit();
      return { message: `Records deleted` };
    } catch (error) {
      await transaction.rollback();
      console.error("Error deleting documents:", error);
      throw error;
    }
  };
}
