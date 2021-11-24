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
  const resultComplexQueryOne = await Project.findOne({
    where: {
      title: "a Project",
      [Sequelize.Op.or]: [{ id: [1, 2, 3] }, { id: { [Sequelize.Op.gt]: 10 } }],
    },
    raw: true,
  });
  console.log(resultComplexQueryOne);

  const resultComplexQueryTwo = await Project.findAll({
    where: {
      title: "a Project",
      id: {
        [Sequelize.Op.or]: [[1, 2, 3], { [Sequelize.Op.gt]: 10 }],
      },
    },
    raw: true,
  });
  console.log(resultComplexQueryTwo);

  // not example
  const resultNotQuery = await Project.findAll({
    where: {
      title: "a Project",
      [Sequelize.Op.not]: [{ id: [1, 2, 3] }],
    },
    raw: true,
  });
  console.log(resultNotQuery);
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
