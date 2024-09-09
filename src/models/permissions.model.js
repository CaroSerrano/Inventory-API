import { DataTypes } from "sequelize";

export default class Permission {
  constructor(data) {
    this.data = data;
  }
  static get model() {
    return "Permissions";
  }
  static initModel(sequelize) {
    return sequelize.define("Permission", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.ENUM('read:roles', 'create:users', 'update:users', 'delete:users', 'read:users', 'create:products', 'update:products', 'delete:products', 'read:products', 'create:categories', 'update:categories', 'delete:categories', 'read:categories', 'create:suppliers', 'update:suppliers', 'delete:suppliers', 'read:suppliers'),
        allowNull: false,
      }
    }, {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    });
  }
}