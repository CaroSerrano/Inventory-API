import { DataTypes } from "sequelize";
import User from "./user.model.js";
import { format } from "@formkit/tempo";

export default class Manager {
  constructor(data) {
    this.data = data;
  }
  static get model() {
    return "Managers";
  }
  static initModel(sequelize) {
    const userAttributes = User.initModel(sequelize).rawAttributes;
    return sequelize.define(
      "Manager",
      {
        ...userAttributes,
        management_level: {
          type: DataTypes.ENUM("Lower-level", "Middle-level", "Top-level"),
          allowNull: false,
          defaultValue: "Lower-level",
        },
        hire_date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          defaultValue: format({
            date: new Date().toISOString(),
            format: "YYYY-MM-DD",
          })
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
