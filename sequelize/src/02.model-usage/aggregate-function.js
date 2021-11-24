const { Sequelize } = require("sequelize");
const sequelize = require("../utils/defaultSequelize");

const attributes = {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: true,
  },
};
class Project extends Sequelize.Model {}
Project.init(attributes, {
  sequelize,
  modelName: "Project",
  freezeTableName: true,
});

async function exam() {
  // # Count
  const resultCountOne = await Project.count();
  console.log("All Count:", resultCountOne);
  const resultCountTwo = await Project.count({
    where: { id: { [Sequelize.Op.gt]: 10 } },
  });
  console.log("id > 10 Count:", resultCountTwo);

  // # max
  const resultMaxOne = await Project.max("id");
  console.log("Max Value:", resultMaxOne);
  const resultMaxTwo = await Project.max("id", {
    where: { id: { [Sequelize.Op.lt]: 20 } },
  });
  console.log("id < 20 Max Value:", resultMaxTwo);

  // # min
  const resultMinOne = await Project.min("id");
  console.log("Min Value:", resultMinOne);
  const resultMinTwo = await Project.min("id", {
    where: { id: { [Sequelize.Op.gt]: 30 } },
  });
  console.log("id > 30 Min Value:", resultMinTwo);

  // # sum
  const resultSumOne = await Project.sum("id");
  console.log("Total Sum:", resultSumOne);
  const resultSumTwo = await Project.sum("id", {
    where: { id: { [Sequelize.Op.gt]: 10 } },
  });
  console.log("id > 10 Sum:", resultSumTwo);
}

sequelize
  .sync({ force: false })
  .then(async () => {
    console.log("[sequelize] table synchronizing success :)");
    await exam();
  })
  .catch((err) => {
    console.error(err);
  });
