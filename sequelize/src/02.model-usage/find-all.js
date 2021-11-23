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
  // # Not Conditions
  const resultNotConditions = await Project.findAll({
    raw: true,
  });
  console.log(resultNotConditions);

  // # Single Conditions
  const resultSingleConditions = await Project.findAll({
    where: {
      title: "a Project",
    },
    raw: true,
  });
  console.log(resultSingleConditions);

  // # Multiple Conditions
  const resultMultipleConditions = await Project.findAll({
    where: {
      id: [1, 12, 23],
    },
    raw: true,
  });
  console.log(resultMultipleConditions);

  // # Sequelize.Op
  const resultOp = await Project.findAll({
    where: {
      id: {
        [Sequelize.Op.gt]: 20,
      },
    },
    raw: true,
  });
  console.log(resultOp);
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
