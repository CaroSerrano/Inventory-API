export default class GenericQueries {
    constructor(dao, model) {
        this.dao = dao;      // Asigna el DAO proporcionado a la propiedad "dao".
        this.model = model;  // Asigna el nombre del modelo proporcionado a la propiedad "model".
    };

    getBy = async (options) => {
        return this.dao.findOne(options, this.model);
    };

    getAll = async (options) => {
        return this.dao.getAll(options, this.model);
    };

    insert = async (data) => {
        // Llama al método `save` del DAO con los datos del nuevo documento y el modelo.
        return this.dao.save(data, this.model);
    };

    insertMany = async(data) => {
       return this.dao.saveMany(data, this.model);
    };

    update = async (id, document) => {
        // Asigna el ID al documento para que el DAO sepa qué documento actualizar.
        console.log("id en generic queries: ", id);
        
        document.id = id;
        // Llama al método `update` del DAO, pasando el documento actualizado y el modelo.
        return this.dao.update(document, this.model);
    };

    delete = async (id) => {
        // Llama al método `delete` del DAO, pasando el ID del documento y el modelo.
        return this.dao.delete(id, this.model);
    };

    deleteMany = async (filter) => {
        return this.dao.deleteMany(filter, this.model);
    };
}
