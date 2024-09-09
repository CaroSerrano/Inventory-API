import { check, body, validationResult } from "express-validator";
import { resErrors } from "./resErrors.js";

export const validateRole = () => {
  return [
    check("roleName")
      .exists()
      .notEmpty()
      .withMessage("El campo roleName no puede estar vacío"),

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
      .withMessage("El campo firstName no puede estar vacío"),
    check("last_name")
      .exists()
      .notEmpty()
      .withMessage("El campo lastName no puede estar vacío"),
    check("email")
      .exists()
      .notEmpty()
      .withMessage("El campo email no puede estar vacío"),
    check("password")
      .exists()
      .notEmpty()
      .withMessage("El campo password no puede estar vacío"),
    // check("role_id")
    //   .exists()
    //   .notEmpty()
    //   .withMessage("El campo role_id no puede estar vacío"),

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
      .withMessage("El campo email no puede estar vacío"),
    check("password")
      .exists()
      .notEmpty()
      .withMessage("El campo password no puede estar vacío"),

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
      .withMessage("El campo Name no puede estar vacío"),
    check("unit_price")
      .exists()
      .isNumeric()
      .withMessage("El campo unit_price no puede estar vacío"),
    check("category_id")
      .exists()
      .isNumeric()
      .withMessage("El campo category_id no puede estar vacío"),
    check("supplier_id")
      .exists()
      .isNumeric()
      .withMessage("El campo supplier_id no puede estar vacío"),

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