export default class GenericQueries {
  constructor(dao, model) {
    this.dao = dao;
    this.model = model;
  }

  getBy = async (options) => {
    return this.dao.findOne(options, this.model);
  };

  getAll = async (options) => {
    return this.dao.getAll(options, this.model);
  };

  insert = async (data) => {
    return this.dao.save(data, this.model);
  };

  insertMany = async (data) => {
    return this.dao.saveMany(data, this.model);
  };

  update = async (id, document) => {
    // Asigna el ID al documento para que el DAO sepa qué documento actualizar.
    document.id = id;
    return this.dao.update(document, this.model);
  };

  delete = async (id) => {
    return this.dao.delete(id, this.model);
  };

  deleteMany = async (filter) => {
    return this.dao.deleteMany(filter, this.model);
  };
}
