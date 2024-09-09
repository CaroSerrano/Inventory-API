import { DataTypes } from "sequelize";

export default class Category {
  constructor(data) {
    this.data = data;
  }
  static get model() {
    return "Categories";
  }
  static initModel(sequelize) {
    return sequelize.define("Category", {
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
