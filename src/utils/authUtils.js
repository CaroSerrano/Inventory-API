import bcrypt from "bcryptjs";

export const createHash = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
  } catch (error) {
    return
  }
  
};

export const isValidPassword = async (user, password) => {
  return await bcrypt.compare(password, user.password);
};
