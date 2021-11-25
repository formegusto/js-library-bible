const { Sequelize } = require("sequelize");
const sequelize = require("./models");
const Project = require("./models/project");
const Task = require("./models/task");

async function exam_1() {
  const task = await Task.create({
    title: "a task",
  });
  console.log(
    task.get({
      plain: true,
    })
  );
  /*
    {
        id: 1,
        title: 'a task',
        updatedAt: 2021-11-25T05:18:10.368Z,
        createdAt: 2021-11-25T05:18:10.368Z
    }
  */

  const deleteTask = await task.destroy();
  console.log(deleteTask.get({ plain: true }));
  /*
    {
        id: 1,
        title: 'a task',
        updatedAt: 2021-11-25T05:18:10.380Z,
        createdAt: 2021-11-25T05:18:10.368Z,
        deletedAt: 2021-11-25T05:18:10.380Z
    } 
  */
  const result = await Task.findAll({
    where: {
      deletedAt: {
        [Sequelize.Op.eq]: null,
      },
    },
    raw: true,
  });
  console.log(result);
}

async function exam_2() {
  const task = await Task.create({
    title: "a task",
  });
  const deleteTask = await task.destroy({ force: true });
  console.log(deleteTask.get({ plain: true }));
  /*
  DELETE FROM `Task` WHERE `id` = 1
  {
    id: 1,
    title: 'a task',
    updatedAt: 2021-11-25T05:20:17.903Z,
    createdAt: 2021-11-25T05:20:17.903Z
    }
  */
}

async function exam_3() {
  const project = await Project.create({
    title: "a project",
  });
  const deleteProject = await project.destroy();
}

async function exam_4() {
  const task = await Task.create({
    title: "a task",
  });
  console.log(
    task.get({
      plain: true,
    })
  );
  /*
    {
        id: 1,
        title: 'a task',
        updatedAt: 2021-11-25T05:18:10.368Z,
        createdAt: 2021-11-25T05:18:10.368Z
    }
  */

  const deleteTask = await task.destroy();
  console.log(deleteTask.get({ plain: true }));
  /*
    {
        id: 1,
        title: 'a task',
        updatedAt: 2021-11-25T05:18:10.380Z,
        createdAt: 2021-11-25T05:18:10.368Z,
        deletedAt: 2021-11-25T05:18:10.380Z
    } 
  */

  const restoreTask = await task.restore();
  console.log(restoreTask.get({ plain: true }));
  /*
    {
        id: 1,
        title: 'a task',
        updatedAt: 2021-11-25T05:29:05.545Z,
        createdAt: 2021-11-25T05:29:05.527Z,
        deletedAt: null
    }
  */
}

sequelize.sync({ force: true }).then(async () => {
  console.log("[sequelize] table synchronizing success :)");

  await exam_4();
});
