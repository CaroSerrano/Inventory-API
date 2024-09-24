import Session from "../models/sessions.model.js";
import GenericQueries from "./gerenicQueries.js";
import { userService, roleService, employeeService, managerService } from "../services/index.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import { isValidPassword } from "../utils/authUtils.js";
import ClientError from "../utils/errors.js";

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
      throw new ClientError("Failed to create session");
    }
  }

  async getUser(email) {
    const user = await userService.getByWithInclude({ email });
    const manager = await managerService.getByWithInclude({ email });
    const employee = await employeeService.getByWithInclude({ email });
    if (!user && !manager && !employee) throw new ClientError("User not found.");
    return user;
  }

  async checkRol(name) {
    const role = await roleService.getBy({ name: name });
    if (!role) throw new ClientError(`Role not found.`);
    return role;
  }

  async signIn(email, password) {
    let user = null;
    let role = null;

    // Check if superadmin
    if (email === config.auth.superadmin_email) {
      role = await this.checkRol("admin");
      user = { email: config.auth.superadmin_email, role_id: role.id }; // Create basic object for superadmin
      role.name = "superadmin";
    } else {
      user = await this.getUser(email);
      role = await this.checkRole(user.role_id);
    }

    // Verify password
    if (
      role.name !== "superadmin" &&
      !(await isValidPassword(user, password))
    ) {
      throw new ClientError("Invalid password.");
    }

    //Create token
    const token = jwt.sign(
      { id: user.id, email: user.email, role_id: user.role_id },
      secret,
      {
        expiresIn: 86400, //24 hours
      }
    );

    // Delete sensitive fields
    const { password: _, ...userResponse } = user;

    //Save session
    if (user) {
      await this.createSession(user.email, role.name, token);
    } else {
      throw new ClientError("Incomplete session data.");
    }

    return { token, user: userResponse };
  }
}
