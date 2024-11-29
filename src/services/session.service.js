import Session from "../models/sessions.model.js";
import GenericQueries from "./gerenicQueries.js";
import {
  userService,
  roleService,
  employeeService,
  managerService,
} from "../services/index.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { isValidPassword } from "../utils/authUtils.js";
import {
  ValidationError,
  NotFoundError,
  AuthorizationError,
  ClientError,
} from "../utils/errors.js";

const secret = config.auth.secret;

export default class SessionService extends GenericQueries {
  constructor(dao) {
    super(dao, Session.model);
  }

  async createSession(email, roleType, token) {
    try {
      const session = {
        email,
        roleType,
        token,
      };

      return await this.insert(session);
    } catch (error) {
      throw new ValidationError(`Failed to create session: ${error.messsage}`);
    }
  }

  async getUser(email) {
    try {
      let user;
      user = await userService.getByWithInclude({ email });
      if (!user) {
        user = await managerService.getByWithInclude({ email });
      }
      if (!user) {
        user = await employeeService.getByWithInclude({ email });
      }
      if (!user) throw new NotFoundError(`User not found`);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async checkRole(param) {
    try {
      const role = await roleService.getBy(param);
      if (!role) throw new NotFoundError(`Role not found.`);
      return role;
    } catch (error) {
      throw error;
    }
  }

  async signIn(email, password) {
    try {
      let user = null;
      let role = null;

      // Check if superadmin
      if (email === config.auth.superadmin_email) {
        role = await this.checkRole({ name: "admin" });
        user = {
          email: config.auth.superadmin_email,
          role_id: role.id,
          roleName: "superadmin",
          password: config.auth.superadmin_password,
        }; // Create basic object for superadmin

        role.name = "superadmin";
      } else {
        user = await this.getUser(email);
        role = await this.checkRole({ id: user.role_id });
      }

      // Verify password
      if (!(await isValidPassword(user, password))) {
        throw new AuthorizationError("Invalid password.");
      }

      //Create token
      const token = jwt.sign(
        { id: user.id, email: user.email, role_id: user.role_id, role: role.name },
        secret,
        {
          expiresIn: 86400, //24 hours
        }
      );
      user.role = role.name;
      // Delete sensitive fields
      const { password: _, ...userResponse } = user;

      //Save session
      if (user) {
        await this.createSession(user.email, role.name, token);
      } else {
        throw new ClientError("Incomplete session data.");
      }

      return { token, user: userResponse };
    } catch (error) {
      throw error;
    }
  }
}
