const { Sequelize } = require("sequelize");
const sequelize = require("../utils/defaultSequelize");
const nestedToJson = require("../utils/nestedToJson");

class User extends Sequelize.Model {}
User.init({ name: Sequelize.STRING }, { sequelize, modelName: "user" });
/*
CREATE TABLE IF NOT EXISTS `users` 
(`id` INTEGER NOT NULL auto_increment , `name` VARCHAR(255), 
`createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, 
PRIMARY KEY (`id`)) 
ENGINE=InnoDB;
*/
class Task extends Sequelize.Model {}
Task.init(
  { name: Sequelize.STRING },
  { sequelize, modelName: "task", paranoid: true }
);
/*
CREATE TABLE IF NOT EXISTS `tasks` 
(`id` INTEGER NOT NULL auto_increment , `name` VARCHAR(255), 
`createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, 
`userId` INTEGER, 
PRIMARY KEY (`id`), 
FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) 
ENGINE=InnoDB;
*/
class Tool extends Sequelize.Model {}
Tool.init({ name: Sequelize.STRING }, { sequelize, modelName: "tool" });
/*
CREATE TABLE IF NOT EXISTS `tools` 
(`id` INTEGER NOT NULL auto_increment , `name` VARCHAR(255), 
`createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, 
`userId` INTEGER, 
PRIMARY KEY (`id`), 
FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) 
ENGINE=InnoDB;
*/
class Teacher extends Sequelize.Model {}
Teacher.init({ name: Sequelize.STRING }, { sequelize, modelName: "teacher" });

Task.belongsTo(User);
User.hasMany(Task);
User.hasMany(Tool, { as: "Instruments" });
Teacher.belongsTo(Task);
Task.hasOne(Teacher);

async function basic_exam() {
  const result = await Task.findAll({ include: [User] });
  const toJson = JSON.parse(JSON.stringify(result));
  console.log(toJson);
  /*
    [
        {
            id: 1,
            name: 'A task',
            createdAt: '2021-11-24T04:52:28.000Z',
            updatedAt: '2021-11-24T04:52:28.000Z',
            userId: 1,
            user: {
                id: 1,
                name: 'John Doe',
                createdAt: '2021-11-24T04:52:28.000Z',
                updatedAt: '2021-11-24T04:52:28.000Z'
            }
        }
    ]
  */
}

async function basic_exam_2() {
  const result = await User.findOne({ where: { id: 1 }, include: [Task] });
  const toJson = JSON.parse(JSON.stringify(result));
  console.log(toJson);
  /*
    {
        id: 1,
        name: 'John Doe',
        createdAt: '2021-11-24T05:05:26.000Z',
        updatedAt: '2021-11-24T05:05:26.000Z',
        tasks: [
            {
                id: 1,
                name: 'A task',
                createdAt: '2021-11-24T05:05:26.000Z',
                updatedAt: '2021-11-24T05:05:26.000Z',
                userId: 1
            },
            {
                id: 2,
                name: 'B task',
                createdAt: '2021-11-24T05:05:26.000Z',
                updatedAt: '2021-11-24T05:05:26.000Z',
                userId: 1
            }
        ]
    }
  */
}

async function basic_exam_3() {
  const result = await User.findOne({
    where: { id: 1 },
    // include: [{ model: Tool, as: "Instruments" }],
    // include: ["Instruments"],
    include: [{ association: "Instruments" }],
  });
  const toJson = JSON.parse(JSON.stringify(result));
  console.log(toJson);
}

async function exam() {
  const result = await User.findAll({
    include: [
      {
        model: Task,
        where: {
          name: { [Sequelize.Op.like]: "A%" },
        },
      },
    ],
  });
  const toJson = JSON.parse(JSON.stringify(result));
  console.log(toJson);
  /*
    [
        {
            id: 1,
            name: 'John Doe',
            createdAt: '2021-11-24T05:24:28.000Z',
            updatedAt: '2021-11-24T05:24:28.000Z',
            tasks: [ [Object] ]
        },
        {
            id: 2,
            name: 'John Smith',
            createdAt: '2021-11-24T05:24:28.000Z',
            updatedAt: '2021-11-24T05:24:28.000Z',
            tasks: [ [Object] ]
        }
    ]
  */
}

async function exam_2() {
  const result = await User.findAll({
    where: {
      "$Instruments.name$": {
        [Sequelize.Op.like]: "%oot%",
      },
    },
    include: {
      model: Tool,
      as: "Instruments",
    },
  });
  const toJson = JSON.parse(JSON.stringify(result));
  console.log(toJson);
}

async function exam_3() {
  const result = await User.findOne({
    where: {
      id: 1,
    },
    include: [
      {
        all: true,
      },
    ],
  });
  const toJson = JSON.parse(JSON.stringify(result));
  console.log(toJson);
}

async function exam_3() {
  const result = await User.findOne({
    where: {
      id: 1,
    },
    include: [
      {
        all: true,
      },
    ],
  });
  const toJson = JSON.parse(JSON.stringify(result));
  console.log(toJson);
}

async function exam_4() {
  //   const result = await Task.destroy({
  //     where: {
  //       name: "C Task",
  //     },
  //   });
  //   console.log(result);
  const resultNotInParanoid = await User.findOne({
    where: {
      id: 2,
    },
    include: [
      {
        model: Task,
        paranoid: true,
      },
    ],
  });
  console.log(JSON.parse(JSON.stringify(resultNotInParanoid)));
  /*
    {
        id: 2,
        name: 'John Smith',
        createdAt: '2021-11-24T05:46:39.000Z',
        updatedAt: '2021-11-24T05:46:39.000Z',
        tasks: [
            {
                id: 3,
                name: 'A task',
                createdAt: '2021-11-24T05:46:39.000Z',
                updatedAt: '2021-11-24T05:46:39.000Z',
                deletedAt: null,
                userId: 2
            }
        ]
    }
  */

  const resultInParanoid = await User.findOne({
    where: {
      id: 2,
    },
    include: [
      {
        model: Task,
        paranoid: false,
      },
    ],
  });
  console.log(JSON.parse(JSON.stringify(resultInParanoid)));
  /*
    {
        id: 2,
        name: 'John Smith',
        createdAt: '2021-11-24T05:46:39.000Z',
        updatedAt: '2021-11-24T05:46:39.000Z',
        tasks: [
            {
                id: 3,
                name: 'A task',
                createdAt: '2021-11-24T05:46:39.000Z',
                updatedAt: '2021-11-24T05:46:39.000Z',
                deletedAt: null,
                userId: 2
            },
            {
                id: 4,
                name: 'C task',
                createdAt: '2021-11-24T05:46:39.000Z',
                updatedAt: '2021-11-24T05:46:39.000Z',
                deletedAt: '2021-11-24T05:46:41.000Z',
                userId: 2
            }
        ]
    }
  */
}

async function exam_5() {
  // # option 1
  const _1 = await User.findOne({
    where: {
      id: 1,
    },
    include: [Task],
    order: [[Task, "name", "DESC"]],
  });
  console.log(nestedToJson(_1));

  // # option 2
  const _2 = await User.findOne({
    where: {
      id: 1,
    },
    include: [{ model: Tool, as: "Instruments" }],
    order: [[{ model: Tool, as: "Instruments" }, "name"]],
  });
  console.log(nestedToJson(_2));

  // # option 3
  const _3 = await User.findOne({
    where: {
      id: 1,
    },
    include: [{ model: Task, include: [Teacher] }],
    order: [[Task, Teacher, "name"]],
  });
  console.log(nestedToJson(_3));
}

async function exam_6() {
  const _1 = await User.findOne({
    where: {
      id: 1,
    },
    include: [
      {
        model: Task,
        include: [
          {
            model: Teacher,
            // include: [/* etc */]
          },
        ],
      },
    ],
  });
  console.log(nestedToJson(_1));

  const _2 = await User.findAll({ include: [{ all: true, nested: true }] });
  console.log(nestedToJson(_2));
}

async function exam_7() {
  const _1 = await User.findOne({
    where: {
      id: 1,
    },
    include: [{ model: Task, right: true }],
  });
  console.log(nestedToJson(_1));

  // required를 설정해버리면, left join과 마찬가지로
  // 무조건 INNER JOIN이 된다.
  const _2 = await User.findOne({
    where: {
      id: 1,
    },
    include: [{ model: Task, right: true, required: true }],
  });
  console.log(nestedToJson(_2));

  // WHERE를 설정해버리면, 암시적으로 required가 true가 된다.
  // 때문에 INNER JOIN이 된다.
  const _3 = await User.findOne({
    where: {
      id: 1,
    },
    include: [
      {
        model: Task,
        where: {
          name: { [Sequelize.Op.like]: "A%" },
        },
        right: true,
      },
    ],
  });
  console.log(nestedToJson(_3));

  const _4 = await User.findOne({
    where: {
      id: 1,
    },
    include: [
      {
        model: Task,
        where: {
          name: { [Sequelize.Op.like]: "A%" },
        },
        right: true,
        required: false,
      },
    ],
  });
  console.log(nestedToJson(_4));
}

sequelize.sync({ force: false }).then(async () => {
  console.log("[sequelize] table synchronizing success :)");

  //   await basic_exam();
  //   await basic_exam_2();
  //   await basic_exam_3();
  //   await exam();
  //   await exam_2();
  //   await exam_3();
  //   await exam_4();
  //   await exam_5();
  await exam_6();
  //   await exam_7();
});
