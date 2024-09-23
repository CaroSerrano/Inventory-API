import { DataTypes } from "sequelize";
import User from "./user.model.js";

export default class Employee extends User {
  constructor(data) {
    super(data);
    this.data = data;
  }
  static get model() {
    return "Employees";
  }
  static initModel(sequelize) {
    const userAttributes = User.initModel(sequelize).rawAttributes;
    return sequelize.define(
      "Employee",
      {
        ...userAttributes,
        position: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        hire_date: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValues: new Date(),
        },
        shift_schedule: {
          type: DataTypes.STRING,
        },
        salary: {
          type: DataTypes.FLOAT,
        },
        manager_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
        store_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
      }
    );
  }
}
