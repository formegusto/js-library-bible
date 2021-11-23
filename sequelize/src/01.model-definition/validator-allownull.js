const { Sequelize } = require("sequelize");
const sequelize = require("../utils/defaultSequelize");

class UserExamOne extends Sequelize.Model {}
UserExamOne.init(
  {
    username: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        len: [5, 10],
      },
    },
  },
  { sequelize }
);

async function ExamOne() {
  console.log("##### Exam One #####");
  try {
    const result = await UserExamOne.create({
      username: null,
    });
    console.log(result);
  } catch (err) {
    console.error(err);
  }
}

class UserExamTwo extends Sequelize.Model {}
UserExamTwo.init(
  {
    age: Sequelize.INTEGER,
    name: {
      type: Sequelize.STRING,
      allowNull: true,
      validate: {
        customValidator(value) {
          if (value === null && this.age !== 10) {
            throw new Error("10살이 아니면, 이름을 비울 수 없어.");
          }
        },
      },
    },
  },
  {
    sequelize,
  }
);
async function ExamTwo() {
  console.log("##### Exam Two #####");
  try {
    const result = await UserExamTwo.create({
      age: 9,
      name: null,
    });
    console.log(result);
  } catch (err) {
    console.error(err.message);
  }
}

class UserExamThree extends Sequelize.Model {}
UserExamThree.init(
  {
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: "이름을 채워주세요.",
        },
      },
    },
  },
  { sequelize }
);
async function ExamThree() {
  console.log("##### Exam Three #####");
  try {
    const result = await UserExamThree.create({
      username: null,
    });
    console.log(result);
  } catch (err) {
    console.error(err.message);
  }
}

sequelize.sync({ force: true }).then(async () => {
  await ExamOne();
  await ExamTwo();
  await ExamThree();
});
