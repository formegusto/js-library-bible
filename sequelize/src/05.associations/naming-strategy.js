const sequelize = require("../utils/defaultSequelize");
const { Model } = require("sequelize");

class User extends Model {}
class Project extends Model {}

User.init({}, { sequelize, modelName: "user" });
Project.init({}, { sequelize, modelName: "project" });

User.hasMany(Project, { as: { singular: "task", plural: "tasks" } });
Project.belongsTo(User);

async function exam() {
  const user = User.build({});
  const project = Project.build({});

  const saveUserResult = await user.save();
  const saveProjectResult = await project.save();
  const saveProjectResultByUser = await user.addTask(project);
  //   console.log(saveProjectResultByUser);
}

class Invoice extends Model {}
class Subscription extends Model {}
Invoice.init({}, { sequelize, modelName: "invoice" });
Subscription.init({}, { sequelize, modelName: "subscription" });

Invoice.belongsTo(Subscription, {
  as: "TheSubscription",
  foreignKey: "subscriptionId",
});
Subscription.hasMany(Invoice, { foreignKey: "subscriptionId" });

sequelize.sync({ force: true }).then(async () => {
  console.log("[database] connected :)");

  await exam();
});
