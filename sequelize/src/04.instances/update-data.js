const sequelize = require("./models");
const Task = require("./models/task");

async function exam_1() {
  const task = Task.build({
    title: "a Task",
    description: "This is Task",
    deadline: new Date(),
  });

  const taskSaveResult = await task.save();
  console.log(
    taskSaveResult.get({
      plain: true,
    })
  );

  const taskUpdateResult = await task.update({
    title: "change a task",
  });
  console.log(
    taskUpdateResult.get({
      plain: true,
    })
  );
}

sequelize.sync({ force: true }).then(async () => {
  console.log("[sequelize] Table Synchronizing Success :)");

  await exam_1();
});
