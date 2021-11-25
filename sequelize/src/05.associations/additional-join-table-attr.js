const sequelize = require("../utils/defaultSequelize");
const { Model, DataTypes } = require("sequelize");

class User extends Model {}
User.init({}, { sequelize, modelName: "user" });
class Project extends Model {}
Project.init({}, { sequelize, modelName: "project" });
class UserProjects extends Model {}
UserProjects.init(
  {
    status: DataTypes.STRING,
  },
  { sequelize, modelName: "userProjects" }
);

User.belongsToMany(Project, { through: UserProjects });
Project.belongsToMany(User, { through: UserProjects });

async function exam() {
  const user = User.build({});
  const project = Project.build({});

  const saveUserResult = await user.save();
  const saveProjectResult = await project.save();
  const saveUserProjectsResult = await user.addProject(project, {
    through: { status: "success" },
  });

  console.log(saveUserProjectsResult);
}

sequelize.sync({ force: true }).then(async () => {
  console.log("[database] connected :)");

  await exam();
});
