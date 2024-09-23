import { DataTypes } from "sequelize";

export default class Store {
  constructor(data) {
    this.data = data;
  }
  static get model() {
    return "Stores";
  }
  static initModel(sequelize) {
    return sequelize.define("Store", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      adress: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      manager_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
    }, {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    });
  }

}

