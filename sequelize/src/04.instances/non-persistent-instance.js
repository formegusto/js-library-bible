const sequelize = require("./models");
const Project = require("./models/project");
const Task = require("./models/task");

async function exam() {
  const project = Project.build({
    title: "test project",
    description: "we are best",
  });
  console.log(project.dataValues);
  // { id: null, title: 'test project', description: 'we are best' }

  const task = Task.build({
    title: "specity the project idea",
    description: "bia",
    deadline: new Date(),
  });
  console.log(task.dataValues);
  /*
  {
    id: null,
    title: 'specity the project idea',
    description: 'bia',
    deadline: 2021-11-25T04:42:15.844Z
  }
  */

  const resultProjectSave = await project.save();
  const resultTaskSave = await task.save();

  console.log(resultProjectSave.dataValues);
  /*
  {
    id: 1,
    title: 'test project',
    description: 'we are best',
    updatedAt: 2021-11-25T04:45:53.293Z,
    createdAt: 2021-11-25T04:45:53.293Z
  }
  */
  console.log(resultTaskSave.dataValues);
  /*
  {
    id: 1,
    title: 'specity the project idea',
    description: 'bia',
    deadline: 2021-11-25T04:45:53.291Z,
    updatedAt: 2021-11-25T04:45:53.303Z,
    createdAt: 2021-11-25T04:45:53.303Z
  }
  */
}

sequelize.sync({ force: true }).then(async () => {
  console.log("[sequelize] table synchronizing success :)");

  await exam();
});
