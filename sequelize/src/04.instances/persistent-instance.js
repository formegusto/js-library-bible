const sequelize = require("./models");
const User = require("./models/user");

async function exam() {
  const userInfo = {
    username: "formegusto",
    isAdmin: true,
  };
  const adminInfo = {
    username: "formegusto",
    isAdmin: true,
  };

  const userSaveResult = await User.create(userInfo, { fields: ["username"] });
  console.log(
    userSaveResult.get({
      plain: true,
    })
  );
  /*
    {
      id: 1,
      username: 'formegusto',
      updatedAt: 2021-11-25T04:55:30.066Z,
      createdAt: 2021-11-25T04:55:30.066Z
    }
    */

  const adminSaveResult = await User.create(adminInfo);
  console.log(
    adminSaveResult.get({
      plain: true,
    })
  );
  /*
    {
      id: 2,
      username: 'formegusto',
      isAdmin: true,
      updatedAt: 2021-11-25T04:55:30.082Z,
      createdAt: 2021-11-25T04:55:30.082Z
    }
    */
}

sequelize.sync({ force: true }).then(async () => {
  console.log("[sequelize] table synchronizing success :)");

  await exam();
});
