import { DataTypes } from "sequelize";

export default class Role {
  constructor(data) {
    this.data = data;
  }
  static get model() {
    return "Roles";
  }
  static initModel(sequelize) {
    return sequelize.define("Role", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.ENUM('admin', 'manager', 'employee', 'basic_user'),
        allowNull: false,
      },
      permissions_ids: {
        type: DataTypes.INTEGER,
        allowNull:false
      }
    }, {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    });
  }
}
