import { DataTypes } from "sequelize";
import getSequelizeConnect from "../utils/getSequelizeConnect";
import Address from "./address";
import { DefineModelStatic } from "./defineModel";
import Project from "./project";
import User from "./user";

const sequelize = getSequelizeConnect();

User.initConfig(sequelize);
Project.initConfig(sequelize);
Address.initConfig(sequelize);

User.associationsConfig();

// define model
export const DefineModel = <DefineModelStatic>sequelize.define("DefineModel", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
});

export default sequelize;
