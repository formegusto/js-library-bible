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
  // # limit offset
  const resultLimitOffset_11 = await Project.findAll({
    limit: 10,
    offset: 1,
    raw: true,
  });
  console.log(resultLimitOffset_11);

  const resultLimitOffset_21 = await Project.findAll({
    limit: 10,
    // 얼마나 스킵할 것인에 대함.
    offset: 11,
    raw: true,
  });
  console.log(resultLimitOffset_21);

  // # order
  const resultOrder = await Project.findAll({
    order: [["id", "DESC"]],
    raw: true,
  });
  console.log(resultOrder);

  // # group
  const resultGroup = await Project.findAll({
    group: "title",
    raw: true,
  });
  console.log(resultGroup);

  // # order extension
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
