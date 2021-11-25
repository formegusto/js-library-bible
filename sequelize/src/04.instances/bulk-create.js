const sequelize = require("./models");
const Task = require("./models/task");
const User = require("./models/user");
const ValidateTask = require("./models/validateTask");

const users = [
  { usernanme: "barfooz", isAdmin: true },
  { username: "foo", isAdmin: true },
  { username: "bar", isAdmin: false },
];

function exam_1() {
  User.bulkCreate(users)
    .then((result) => {
      return User.findAll({
        raw: true,
      });
    })
    .then((users) => {
      console.log(users);
    });
}

const tasks = [
  { subject: "programming", status: "executing" },
  { subject: "reading", status: "executing" },
  { subject: "programming", status: "finished" },
];

function exam_2() {
  Task.bulkCreate(tasks)
    .then(() => {
      return Task.update(
        {
          status: "inactive",
        },
        {
          where: {
            subject: "programming",
          },
        }
      );
    })
    .then(([affectedCount, affectedRows]) => {
      console.log("변화 : ", affectedCount);

      return Task.findAll({
        where: {
          subject: "programming",
        },
        raw: true,
      });
    })
    .then((result) => {
      console.log(result);
    });
}

function exam_3() {
  Task.bulkCreate(tasks)
    .then(() => {
      return Task.destroy({
        where: {
          subject: "programming",
        },
        truncate: true,
        // 외래키를 모두 무시하고 데이터를 지운다.
      });
    })
    .then((affectedRows) => {
      return Task.findAll({
        raw: true,
      });
    })
    .then((result) => {
      console.log(result);
    });
}

const validateTasks = [
  { name: "foo", code: "123" },
  { code: "1234" },
  { name: "bar", code: "1" },
];
async function exam_4() {
  try {
    const result = await ValidateTask.bulkCreate(validateTasks, {
      validate: true,
    });

    console.log(result);
  } catch (err) {
    console.log(err);
    err.forEach((e) => console.log(e.message));
    /*
        notNull Violation: name cannot be null
        Validation error: code is [code >= 3] and [code <= 10]
    */
  }
}

sequelize.sync({ force: true }).then(async () => {
  console.log("[sequelize] table synchroninzing success");

  //   exam_3();
  await exam_4();
});
