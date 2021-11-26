import getSequelizeConnect from "../utils/getSequelizeConnect";
import Address from "./address";
import Project from "./project";
import User from "./user";

const sequelize = getSequelizeConnect();

User.initConfig(sequelize);
Project.initConfig(sequelize);
Address.initConfig(sequelize);

User.associationsConfig();

export default sequelize;
