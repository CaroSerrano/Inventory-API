import bcrypt from "bcryptjs";

export const createHash = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  } catch (error) {
    console.error(error.message);
    return;
  }
};

export const isValidPassword = async (user, password) => {
  try {
    if(user.roleName && user.roleName === "superadmin"){
      return password === user.password;
    }
    return await bcrypt.compare(password, user.password);
  } catch (error) {
    console.error(error.message);
    return;    
  }
};
