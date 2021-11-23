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
  const result = await Project.findAndCountAll({
    where: {
      title: {
        [Sequelize.Op.like]: "a%",
      },
    },
    // 몇 번째 페이지? 에 대한 개념
    offset: 1,

    // 한 페이지당 얼마나? 에 대한 개념
    limit: 10,
    raw: true,
  });

  // 전체 데이터 개수
  console.log(result.count);
  // 현재 offset에 대한 limit 만큼의 데이터
  console.log(result.rows);
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
