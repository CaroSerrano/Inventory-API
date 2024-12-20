import { DataTypes } from "sequelize";

export default class User {
  constructor(data) {
    this.data = data;
  }
  static get model() {
    return "Users";
  }
  static initModel(sequelize) {
    return sequelize.define("User", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      first_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      last_name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull:false,

      }
    }, {
      timestamps: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    });
  }

}

