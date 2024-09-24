import { check, validationResult } from "express-validator";
import {
  managerService,
  categoryService,
  supplierService,
  storeService,
  roleService
} from "../../services/index.js";
import { resErrors } from "../resErrors.js";
import ClientError from "../errors.js";

export const validateCreateRole = () => {
  return [
    check("name").exists().notEmpty().withMessage("'name' property required.").bail()
    .custom(async (value) => {
      const role = await roleService.getBy({ name: value });
      if (role) {
        throw new ClientError(`Role ${value} already exists.`)
      }
    }),
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const checkError = errors.array().map((error) => error.msg);
        resErrors(res, 400, checkError);
        return;
      }
      next();
    },
  ];
};

export const validateCreateUser = () => {
  return [
    check("first_name")
      .exists()
      .notEmpty()
      .withMessage("'first_name' property required.")
      .isAlpha("es-ES", { ignore: " " })
      .withMessage("'first_name' can not have numbers."),
    check("last_name")
      .exists()
      .notEmpty()
      .withMessage("'last_name' property required.")
      .isAlpha("es-ES", { ignore: " " })
      .withMessage("'last_name' can not have numbers."),
    check("email")
      .exists()
      .notEmpty()
      .isEmail()
      .withMessage("'email' property required."),
    check("password")
      .exists()
      .notEmpty()
      .withMessage("'password' property required.")
      .isLength({ min: 4 })
      .withMessage("'password'must have 4 characters minimum"),
    check("role_id")
      .exists()
      .withMessage("'role_id' property required.")
      .isInt()
      .withMessage("'role_id' must be an integer")
      .custom(async (value) => {
        const role = await roleService.getBy({ id: value });
        if (!role) {
          throw new ClientError("Role not found.");
        }
      }),
    check("management_level")
      .optional()
      .isIn(["Lower-level", "Middle-level", "Top-level"])
      .withMessage(
        'Allowed management_level values are "Lower-level", "Middle-level" and "Top-level"'
      ),
    check("hire_date")
      .optional()
      .isDate()
      .withMessage("hire_date must be in date format"),
    check("position")
      .optional()
      .notEmpty()
      .withMessage("'position' property required"),
    check("shift_schedule")
      .optional()
      .notEmpty()
      .withMessage("'shift_schedule' property required"),
    check("salary")
      .optional()
      .isNumeric()
      .withMessage("'salary' must be a number"),
    check("manager_id")
      .optional()
      .custom(async (value) => {
        const manager = await managerService.getBy({ id: value });
        if (!manager) {
          throw new ClientError("Manager not found.");
        }
      }),
    check("store_id")
      .optional()
      .custom(async (value) => {
        const store = await storeService.getBy({ id: value });
        if (!store) {
          throw new ClientError("Store not found.");
        }
      }),

    (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const checkError = errors.array().map((error) => error.msg);
        resErrors(res, 400, checkError);
        return;
      }
      next();
    },
  ];
};

export const validateSignin = () => {
  return [
    check("email")
      .exists()
      .notEmpty()
      .withMessage("'email' property required.")
      .bail()
      .isEmail()
      .withMessage("Invalid email format")
      .bail(),
    check("password")
      .exists()
      .notEmpty()
      .withMessage("'password' property required."),

    (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const checkError = errors.array().map((error) => error.msg);
        resErrors(res, 400, checkError);
        return;
      }
      next();
    },
  ];
};

export const validateCreateProduct = () => {
  return [
    check("name")
      .exists()
      .notEmpty()
      .withMessage("'name' property required.")
      .bail(),
    check("unit_price")
      .exists()
      .withMessage("'unit_price' property required.")
      .bail()
      .isNumeric()
      .withMessage("'unit_price' must be numeric.")
      .bail(),
    check("category_id")
      .exists()
      .withMessage("'category_id' property required.")
      .bail()
      .isInt()
      .withMessage("'category_id' must be an integer.")
      .bail()
      .custom(async (value) => {
        const category = await categoryService.getBy({ id: value });
        if (!category) {
          throw new ClientError("Category not found.");
        }
      })
      .bail(),
    check("supplier_id")
      .exists()
      .withMessage("'supplier_id' property required.")
      .isInt()
      .withMessage("'supplier_id' must be an integer.")
      .custom(async (value) => {
        const supplier = await supplierService.getBy({ id: value });
        if (!supplier) {
          throw new ClientError("Supplier not found.");
        }
      }),

    (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const checkError = errors.array().map((error) => error.msg);
        resErrors(res, 400, checkError);
        return;
      }
      next();
    },
  ];
};

export const validateCreateSupplierAndCategory = () => {
  return [
    check("name")
      .exists()
      .notEmpty()
      .withMessage("'name' property required.")
      .custom(async (value) => {
        const supplier = await supplierService.getBy({ name: value });
        const category = await categoryService.getBy({ name: value });
        if (supplier || category)
          throw new ClientError(`Name ${value} already exists.`);
      }),

    (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const checkError = errors.array().map((error) => error.msg);
        resErrors(res, 400, checkError);
        return;
      }
      next();
    },
  ];
};

export const validateCreateStore = () => {
  return [
    check("adress")
      .exists()
      .notEmpty()
      .withMessage("'adress' property required.")
      .bail(),
    check("manager_id")
      .exists()
      .isInt()
      .withMessage("manager_id must be an integer")
      .bail()
      .custom(async (value) => {
        const manager = await managerService.getBy({ id: value });
        if (!manager) {
          throw new ClientError("Manager not found.");
        }
      }),

    (req, res, next) => {
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        const checkError = errors.array().map((error) => error.msg);
        resErrors(res, 400, checkError);
        return;
      }
      next();
    },
  ];
};
