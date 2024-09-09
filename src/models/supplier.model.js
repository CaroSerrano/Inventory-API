import { DataTypes } from "sequelize";

export default class Supplier {
  constructor(data) {
    this.data = data;
  }
  static get model() {
    return "Suppliers";
  }
  static initModel(sequelize) {
    return sequelize.define("Supplier", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    }, {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    });
  }
}
