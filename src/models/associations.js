export default function setupAssociations(models) {
  models.Users.belongsTo(models.Roles, { foreignKey: "role_id", as: "role" });
  models.Roles.hasMany(models.Users, { foreignKey: "role_id", as: "users" });
  models.Roles.belongsToMany(models.Permissions, {
    through: "rolepermissions",
    foreignKey: "role_id",
    otherKey: "permission_id",
    as: "permissions",
  });
  models.Permissions.belongsToMany(models.Roles, {
    through: "rolepermissions",
    foreignKey: "permission_id",
    otherKey: "role_id",
    as: "roles",
  });
  models.Managers.hasMany(models.Employees, {
    foreignKey: "manager_id",
    as: "employees",
  });
  models.Employees.belongsTo(models.Managers, {
    foreignKey: "manager_id",
    as: "manager",
  });
  models.Managers.hasMany(models.Stores, {
    foreignKey: "manager_id",
    as: "stores"
  });
  models.Stores.belongsTo(models.Managers, {
    foreignKey: "manager_id",
    as: "manager"
  })
  models.Categories.hasMany(models.Products, {
    foreignKey: "category_id",
    as: "products",
  });
  models.Products.belongsTo(models.Categories, {
    foreignKey: "category_id",
    as: "category",
  });
  models.Suppliers.hasMany(models.Products, {
    foreignKey: "supplier_id",
    as: "products",
  });
  models.Products.belongsTo(models.Suppliers, {
    foreignKey: "supplier_id",
    as: "supplier",
  });
}
