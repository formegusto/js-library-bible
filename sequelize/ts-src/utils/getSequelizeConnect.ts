import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const { MYSQL_DBNAME, MYSQL_USERNAME, MYSQL_PASSWORD, MYSQL_HOST, MYSQL_PORT } =
  process.env;

export default function getSequelizeConnect(): Sequelize {
  return new Sequelize(MYSQL_DBNAME!, MYSQL_USERNAME!, MYSQL_PASSWORD!, {
    host: MYSQL_HOST!,
    port: parseInt(MYSQL_PORT!),
    dialect: "mysql",
  });
}
