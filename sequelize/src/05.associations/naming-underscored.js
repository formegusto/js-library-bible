const sequelize = require("../utils/defaultSequelize");
const { Model } = require("sequelize");

class TestOne extends Model {}
class TestTwo extends Model {}

TestOne.init({}, { sequelize, modelName: "test_one" });
TestTwo.init({}, { sequelize, modelName: "test_two" });

TestOne.hasMany(TestTwo);
TestTwo.belongsTo(TestOne);

async function exam() {
  const test_one = await TestOne.create();
  const test_two = await TestTwo.create();

  // 정말 일관성 있는 친구였다.
  await test_one.addTest_two(test_two);
}

sequelize.sync({ force: true }).then(async () => {
  console.log("[database] connected :)");

  await exam();
});
