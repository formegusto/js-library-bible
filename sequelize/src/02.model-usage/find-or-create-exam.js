const { Sequelize } = require("sequelize");
const sequelize = require("../utils/defaultSequelize");

class User extends Sequelize.Model {}
const attributes = {
  username: Sequelize.STRING,
  job: Sequelize.STRING,
};
User.init(attributes, {
  sequelize,
  modelName: "user",
  freezeTableName: true,
});

async function exam() {
  const [user, created] = await User.findOrCreate({
    where: {
      username: "sdepold",
    },
    // where 문으로 조회한 데이터 뿐만 아니라,
    // 다른 칼럼에도 데이터를 넣기 위한 작업
    defaults: {
      job: "Techincal Lead JavaScript",
    },
  });

  console.log("is created :", created);
  console.log(
    user.get({
      plain: true,
    })
  );

  const _ = await User.create({
    username: "formegusto",
    job: "hello, iamformegusto :)",
  });
  const [formegusto, isCreated] = await User.findOrCreate({
    where: {
      username: "formegusto",
    },
    defaults: {
      job: "bye, weareformegusto :)",
    },
  });
  console.log("is created :", isCreated);
  console.log(
    formegusto.get({
      plain: true,
    })
  );
}

sequelize
  .sync({ force: true })
  .then(async () => {
    console.log("[sequelize] table synchronizing success :)");
    await exam();
  })
  .catch((err) => {
    console.error(err);
  });
