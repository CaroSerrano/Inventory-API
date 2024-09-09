import { DataTypes } from "sequelize";

export default class Product {
  constructor(data) {
    this.data = data;
  }
  static get model() {
    return "Products";
  }
  static initModel(sequelize) {
    return sequelize.define("Product", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
      },
      unit_price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
      },
      units_in_stock: {
        type: DataTypes.INTEGER,
      },
      category_id: {
        type: DataTypes.INTEGER,
      },
      supplier_id: {
        type: DataTypes.INTEGER,
      },
    }, {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    });
  }
}
