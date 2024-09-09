import dotenv from "dotenv";
dotenv.config();

export default {
  env: process.env.NODE_ENV || 'dev',
  PORT: process.env.PORT || 3000,
  db: {
    DB_HOST: process.env.DB_HOST,
    DB_USER: process.env.DB_USER,
    DB_PASS: process.env.DB_PASS,
    DB_NAME: process.env.DB_NAME,
    DB_PORT: process.env.DB_PORT,
    dialect:'mysql'
  }
  
};

