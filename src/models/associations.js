export default function setupAssociations(models) {
  //One to many association between Roles and Users
  models.Users.belongsTo(models.Roles, { foreignKey: "role_id", as: "role" });
  models.Roles.hasMany(models.Users, { foreignKey: "role_id", as: "users" });

  //Many to many association between Roles and Permissions
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

  //One to many association between Managers and Employees
  models.Managers.hasMany(models.Employees, {
    foreignKey: "manager_id",
    as: "employees",
  });
  models.Employees.belongsTo(models.Managers, {
    foreignKey: "manager_id",
    as: "manager",
  });

  //One to many association between Manager and Stores
  models.Managers.hasMany(models.Stores, {
    foreignKey: "manager_id",
    as: "stores",
  });
  models.Stores.belongsTo(models.Managers, {
    foreignKey: "manager_id",
    as: "manager",
  });

  //One to many association between Stores and Employees
  models.Stores.hasMany(models.Employees, {
    foreignKey: "store_id",
    as: "employees",
  });
  models.Employees.belongsTo(models.Stores, {
    foreignKey: 'store_id',
    as: "store",
  });

  //One to many association between Categories and Products
  models.Categories.hasMany(models.Products, {
    foreignKey: "category_id",
    as: "products",
  });
  models.Products.belongsTo(models.Categories, {
    foreignKey: "category_id",
    as: "category",
  });

  //One to many association between Suppliers and Products
  models.Suppliers.hasMany(models.Products, {
    foreignKey: "supplier_id",
    as: "products",
  });
  models.Products.belongsTo(models.Suppliers, {
    foreignKey: "supplier_id",
    as: "supplier",
  });
}
