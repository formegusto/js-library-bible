const sequelize = require("./models");
const Project = require("./models/project");
const User = require("./models/user");

async function exam() {
  const project = await Project.create();
  const user = await User.create();

  const isProjectHasUser_1 = await project.hasWorker(user);
  console.log(
    `project id [${project.id}] has ${
      isProjectHasUser_1 ? "" : '"not"'
    } user [${user.id}]`
  ); // project id [1] has "not" user [1]

  await project.addWorker(user);
  const isProjectHasUser_2 = await project.hasWorker(user);
  console.log(
    `project id [${project.id}] has ${
      isProjectHasUser_2 ? "" : '"not "'
    }user [${user.id}]`
  ); // project id [1] has user [1]

  const user2 = await User.create();
  const users = [user, user2];
  const isProjectHasUsers_1 = await project.hasWorkers(users);
  console.log(
    `project id [${project.id}] has ${
      isProjectHasUsers_1 ? "" : '"not"'
    } users [${users
      .slice(1)
      .reduce((acc, cur) => acc + "," + cur.id, users[0].id.toString())}]`
  ); // project id [1] has "not" users [1,2]

  await project.setWorkers(users);
  const isProjectHasUsers_2 = await project.hasWorkers(users);
  console.log(
    `project id [${project.id}] has ${
      isProjectHasUsers_2 ? "" : '"not "'
    }users [${users
      .slice(1)
      .reduce((acc, cur) => acc + "," + cur.id, users[0].id.toString())}]`
  ); // project id [1] has users [1,2]
}

sequelize.sync({ force: true }).then(async () => {
  console.log("[database] connected :)");

  await exam();
});
