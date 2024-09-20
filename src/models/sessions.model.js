import { DataTypes } from "sequelize";

export default class Session {
  constructor(data) {
    this.data = data;
  }
  static get model() {
    return "Sessions";
  }
  static initModel(sequelize) {
    return sequelize.define(
      "Session",
      {
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        roleType: {
          type: DataTypes.ENUM("admin", "manager", "employee", "basic_user"),
          allowNull: false,
        },
        token: { type: DataTypes.STRING, allowNull: false },
      },
      {
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
      }
    );
  }
}
