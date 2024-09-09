import { Sequelize } from "sequelize";
// import  db  from "../config/config.js";
import User from "./user.model.js";
import Product from "./product.model.js";
import Role from "./role.model.js";
export default class Dao {
  // Primero, creamos el constructor que manejará la conexión a la base de datos.
  constructor(sequelizeConfig) {
    // Crear una instancia de Sequelize para la conexión
    this.sequelize = new Sequelize(sequelizeConfig.DB_NAME, sequelizeConfig.DB_USER, sequelizeConfig.DB_PASS, {
      host: sequelizeConfig.DB_HOST,
      dialect: sequelizeConfig.dialect,
      logging: false, // Deshabilita el logging de SQL para evitar ruido
    });

    this.sequelize.authenticate().then(() => {
      console.log('Connection established succesfully.');
    }).catch(error => {
      console.error('Error connecting to database:', error);
      process.exit(1);
    });

    // Definir los modelos utilizando Sequelize
    this.models = {
      [User.model]: User.initModel(this.sequelize),
      [Product.model]: Product.initModel(this.sequelize),
      [Role.model]: Role.initModel(this.sequelize),
    };
  }
  async initialize() {
    await this.syncModels(); // Sincroniza los modelos al inicializar el DAO
  }
    // Función para sincronizar todos los modelos con la base de datos
    async syncModels() {
    await this.sequelize.sync({ force: false }); // `force: true` recrea las tablas
    }

  // Método para encontrar un único documento que coincida con los criterios especificados.
  findOne = async (options, entity) => {
    if (!this.models[entity]) throw new Error(`Entity ${entity} not in dao schemas`);
    try {
      let result = await this.models[entity].findOne({ where: options });
      return result ? result.get({ plain: true }) : null;  // Convierte el resultado en un objeto plano
    } catch (error) {
      console.error("Error finding document:", error);
      return null;
    }
  };
  

  // Método para obtener todos los documentos que coincidan con los criterios especificados.
  getAll = async (options, entity) => {
    if (!this.models[entity]) throw new Error(`Entity ${entity} not in dao schemas`);
    try {
      // `findAll` en Sequelize se usa para obtener múltiples registros
      let results = await this.models[entity].findAll({ where: options });
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
      return result.get({ plain: true });
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
    if (!this.models[entity]) throw new Error(`Entity ${entity} not in dao schemas`);
    let id = document.id;
    delete document.id;
    try {
      // `update` en Sequelize actualiza registros, pero no devuelve el registro actualizado directamente
      await this.models[entity].update(document, { where: { id } });
      let result = await this.models[entity].findByPk(id);  // Debes volver a buscar el registro actualizado
      return result ? result.get({ plain: true }) : null;
    } catch (error) {
      console.error("Error updating document:", error);
      return null;
    }
  };
  

  // Método para eliminar un documento de la base de datos.
  delete = async (id, entity) => {
    if (!this.models[entity]) throw new Error(`Entity ${entity} not in dao schemas`);
    try {
      let result = await this.models[entity].destroy({ where: { id } });
      return result ? { message: 'Deleted successfully' } : null;
    } catch (error) {
      console.error("Error deleting document:", error);
      return null;
    }
  };
  
  //Eliminar múltiples documentos
  deleteMany = async (filter, entity) => {
    if (!this.models[entity]) throw new Error(`Entity ${entity} not in dao schemas`);
    try {
      let result = await this.models[entity].destroy({ where: filter });
      return result ? result : null;
    } catch (error) {
      console.error("Error deleting documents:", error);
      return null;
    }
  };  
}
