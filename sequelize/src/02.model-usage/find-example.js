const { Sequelize } = require("sequelize");
const sequelize = require("../utils/defaultSequelize");

class Project extends Sequelize.Model {}
const attributes = {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

Project.init(attributes, {
  sequelize,
  modelName: "Project",
  freezeTableName: true,
});
async function createProject() {
  console.log("#### Test Data Create ####");
  const result = await Project.create({
    title: "a Project",
    name: "formegusto",
  });
  console.log(result.dataValues);

  // # findByPk()
  // PrimaryKey 를 통해 조회
  const findByPkResult = await Project.findByPk(1, {
    raw: true,
  });
  console.log(findByPkResult);

  // # findOne
  // 속성 조건을 기반으로 조회
  const findOneResult = await Project.findOne({
    where: {
      title: "a Project",
    },
    raw: true,
  });
  console.log(findOneResult);

  // # findOne _ 2
  // 특정 칼럼만 결과물로 나타나도록 조회
  const findOneTwoResult = await Project.findOne({
    where: {
      title: "a Project",
    },
    attributes: ["id", "name"],
    raw: true,
  });
  console.log(findOneTwoResult);
}

sequelize
  .sync({ force: true })
  .then(async () => {
    console.log("[sequelize] table synchronizing success :)");
    await createProject();
  })
  .catch((err) => {
    console.error(err);
  });
