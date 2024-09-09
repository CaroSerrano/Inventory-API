export default function setupAssociations(models) {
  models.Users.belongsTo(models.Roles, { foreignKey: "role_id", as: "role" });
  models.Roles.hasMany(models.Users, { foreignKey: "role_id", as: "users" });
  models.Roles.belongsToMany(models.Permissions, { 
    through: "RolePermissions", 
    foreignKey: "role_id",
    otherKey: "permission_id",
    as: "permissions"
  });
  models.Permissions.belongsToMany(models.Roles, { 
    through: "RolePermissions", 
    foreignKey: "permission_id",
    otherKey: "role_id",
    as: "roles"
  });
  models.Categories.hasMany(models.Products, { foreignKey: "category_id", as: "products" });
  models.Products.belongsTo(models.Categories, {
    foreignKey: "category_id",
    as: "category",
  });
  models.Suppliers.hasMany(models.Products, { foreignKey: "supplier_id", as: "products" });
  models.Products.belongsTo(models.Suppliers, {
    foreignKey: "supplier_id",
    as: "supplier",
  });
}
