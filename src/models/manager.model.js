import { DataTypes } from "sequelize";
import User from "./user.model.js";

export default class Manager extends User {
  constructor(data) {
    super(data);
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
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: new Date(),
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
