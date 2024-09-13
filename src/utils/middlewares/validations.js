import { check, body, validationResult } from "express-validator";
import { resErrors } from "../resErrors.js";

export const validateRole = () => {
  return [
    check("name")
      .exists()
      .notEmpty()
      .withMessage("'name' property required."),

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
      .withMessage("'first_name' property required."),
    check("last_name")
      .exists()
      .notEmpty()
      .withMessage("'last_name' property required."),
    check("email")
      .exists()
      .notEmpty()
      .withMessage("'email' property required."),
    check("password")
      .exists()
      .notEmpty()
      .withMessage("'password' property required."),
    check("role_id")
      .exists()
      .withMessage("'role_id' property required."),

    (req, res, next) => {
      const errors = validationResult(req);
      console.log("errors de validate: ", errors);
      
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
      .withMessage("'email' property required."),
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
      .withMessage("'name' property required."),
    check("unit_price")
      .exists()
      .isNumeric()
      .withMessage("'unit_price' property required."),
    check("category_id")
      .exists()
      .isNumeric()
      .withMessage("'category_id' property required."),
    check("supplier_id")
      .exists()
      .isNumeric()
      .withMessage("'supplier_id' property required."),

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
      .withMessage("'name' property required."),

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