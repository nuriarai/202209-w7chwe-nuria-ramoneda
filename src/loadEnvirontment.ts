import dotenv from "dotenv";
dotenv.config();

const environtment = {
  port: process.env.PORT,
  dbUrl: process.env.MONGODB_URL,
};

export default environtment;
