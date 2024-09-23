import bcrypt from "bcryptjs";
import { Op } from "sequelize";

// Método para inicializar permisos
async function initPermissions(models) {
  const initialPermissions = [
    { name: "create:users" },
    { name: "update:users" },
    { name: "delete:users" },
    { name: "read:users" },
    { name: "create:products" },
    { name: "update:products" },
    { name: "delete:products" },
    { name: "read:products" },
    { name: "create:categories" },
    { name: "update:categories" },
    { name: "delete:categories" },
    { name: "read:categories" },
    { name: "create:suppliers" },
    { name: "update:suppliers" },
    { name: "delete:suppliers" },
    { name: "read:suppliers" },
    { name: "create:roles" },
    { name: "update:roles" },
    { name: "delete:roles" },
    { name: "read:roles" },
    { name: "create:stores" },
    { name: "update:stores" },
    { name: "delete:stores" },
    { name: "read:stores" },
  ];

  try {
    // Verificar si ya existen permisos
    const existingPermissions = await models.Permissions.findAll();
    if (existingPermissions.length === 0) {
      // Si no hay permisos, crear los permisos iniciales
      await models.Permissions.bulkCreate(initialPermissions);
      console.log("Permissions initialized successfully.");
    } else {
      console.log("Permissions already exist.");
    }
  } catch (error) {
    console.error("Error initializing permissions:", error);
  }
}

async function initRoles(models) {
  try {
    const existingRoles = await models.Roles.findAll();
    if (existingRoles.length === 0) {
      const adminPermissions = await models.Permissions.findAll();

      const admin = await models.Roles.create({ name: "admin" });

      const managerRegex = "\\b(products|suppliers|categories)\\b";
      const managerPermissions = await models.Permissions.findAll({
        where: { name: { [Op.regexp]: managerRegex } },
      });
      const manager = await models.Roles.create({ name: "manager" });

      const employeeRegex = "^(create|update|read):products$";
      const employeePermissions = await models.Permissions.findAll({
        where: { name: { [Op.regexp]: employeeRegex } },
      });
      const employee = await models.Roles.create({ name: "employee" });

      const userRegex = "^read:products$";
      const userPermissions = await models.Permissions.findAll({
        where: { name: { [Op.regexp]: userRegex } },
      });
      const basic_user = await models.Roles.create({
        name: "basic_user",
      });

      await admin.addPermissions(adminPermissions);
      await manager.addPermissions(managerPermissions);
      await employee.addPermissions(employeePermissions);
      await basic_user.addPermissions(userPermissions);
      console.log("Roles initialized successfully.");
    } else {
      console.log("Roles already exist.");
    }
  } catch (error) {
    console.error("Error initializing roles: ", error);
  }
}

async function createSuperAdmin(models) {
  try {
    const superAdminRole = await models.Roles.findOne({
      where: { name: "admin" },
    });

    const roleId = superAdminRole.id;

    const superAdmin = await models.Users.findOne({
      where: {
        email: "superadmin@example.com",
      },
    });

    if (!superAdmin) {
      const hashedPassword = await bcrypt.hash("superadminpassword", 10);

      const newSuperAdmin = await models.Users.create({
        first_name: "super",
        last_name: "admin",
        email: "superadmin@example.com",
        password: hashedPassword,
        role_id: roleId,
      });

      console.log("Super Admin creation succeded", {
        Email: newSuperAdmin.email,
      });
    } else {
      console.log("Super Admin already exists.", {
        Email: superAdmin.email,
      });
    }
  } catch (error) {
    console.error("Super Admin creation failed:", error);
  }
}

export default { initPermissions, initRoles, createSuperAdmin };
