import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_DIALECT } = process.env;

const sequelize = new Sequelize(
  DB_NAME as string,
  DB_USER as string,
  DB_PASSWORD as string,
  {
    host: DB_HOST,
    dialect: (DB_DIALECT as "mysql" | "postgres" | "sqlite") || "mysql",
    dialectOptions: { decimalNumbers: true },
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

export default sequelize;
