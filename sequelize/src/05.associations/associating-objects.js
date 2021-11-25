const sequelize = require("./models");
const { Sequelize } = require("sequelize");
const Project = require("./models/project");
const Task = require("./models/task");
const User = require("./models/user");

async function exam() {
  const Op = Sequelize.Op;
  const project = await Project.create({
    status: "success",
  });
  const task1 = await Task.create({
    title: "lunch thinking.",
  });
  const task2 = await Task.create({
    title: "dinner thinking",
  });

  await project.setTasks([task1, task2]);
  const saveProjectTasks = await project.getTasks({
    raw: true,
  });
  console.log("saveResult 1 :", saveProjectTasks);
  /*
  saveResult 1 : [
  {
    id: 1,
    title: 'lunch thinking.',
    createdAt: 2021-11-25T15:32:47.000Z,
    updatedAt: 2021-11-25T15:32:47.000Z,
    projectId: 1
  },
  {
    id: 2,
    title: 'dinner thinking',
    createdAt: 2021-11-25T15:32:47.000Z,
    updatedAt: 2021-11-25T15:32:47.000Z,
    projectId: 1
  }
]
  */

  const conditionResult = await project.getTasks({
    attributes: ["title"],
    where: {
      id: {
        [Op.eq]: 2,
      },
    },
    raw: true,
  });
  console.log("conditionResult :", conditionResult);

  await project.setTasks([task1]);
  const saveProjectTasks2 = await project.getTasks({
    raw: true,
  });
  console.log("saveResult 2 :", saveProjectTasks2);
  /*
  saveResult 2 : [
  {
    id: 1,
    title: 'lunch thinking.',
    createdAt: 2021-11-25T15:32:47.000Z,
    updatedAt: 2021-11-25T15:32:47.000Z,
    projectId: 1
  }
]
  */
  await project.removeTask(task1);
  const saveProjectTasks3 = await project.getTasks({
    raw: true,
  });
  console.log("saveResult 3 :", saveProjectTasks3);

  await project.addTask(task2);
  const saveProjectTasks4 = await project.getTasks({
    raw: true,
  });
  console.log("saveResult 4 :", saveProjectTasks4);

  await task2.setProject(null);
  const saveProjectTasks5 = await project.getTasks({
    raw: true,
  });
  console.log("saveResult 5 :", saveProjectTasks5); // []
}

async function exam_2() {
  const user = await User.create();
  const project_1 = await Project.create();

  project_1.UserProjects = {
    status: "active",
  };
  await user.addTask(project_1);
  //   await user.addTask(project_1, {through: {status: 'success'}})

  const userHasProject_1 = await user.getTasks({
    raw: true,
  });
  console.log(userHasProject_1);
  console.log(userHasProject_1[0]["UserProjects.status"]);

  project_1.UserProjects = {
    status: "incative",
  };
  await user.setTasks(project_1);
  const userHasProject_2 = await user.getTasks({
    attributes: [],
    joinTableAttributes: ["status"],
    // raw: true,
  });
  console.log(userHasProject_2[0].UserProjects.get({ plain: true }));
}

sequelize.sync({ force: true }).then(async () => {
  console.log("[database] connected :)");

  //   await exam();
  await exam_2();
});
