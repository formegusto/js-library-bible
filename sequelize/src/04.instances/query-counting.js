const sequelize = require("./models");
const User = require("./models/user");

async function exam() {
  const aUser = User.build({
    username: "formegusto",
    isAdmin: true,
    age: 26,
  });
  const saveUser = await aUser.save();
  console.log(saveUser.get({ plain: true }));

  // Postgres 만 변경된거를 반환해준다. 다른 dialect는 reload 사용
  await saveUser.increment(["age"], { by: 2 });
  const incUser = await saveUser.reload();
  console.log(incUser.get({ plain: true })["age"]); // 28

  await saveUser.decrement(["age"], { by: 4 });
  const decUser = await saveUser.reload();
  console.log(decUser.get({ plain: true })["age"]); // 24
}

sequelize.sync({ force: true }).then(async () => {
  console.log("[sequelize] table synchronizing success :)");

  await exam();
});
