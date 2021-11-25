const { Sequelize } = require("sequelize");
const sequelize = require("../utils/defaultSequelize");

class TestModel extends Sequelize.Model {}
TestModel.init(
  {
    foo: Sequelize.STRING,
    bar: Sequelize.STRING,
    hats: {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    },
  },
  {
    modelName: "TestModel",
    tableName: "TestModel",
    timestamps: false,
    sequelize,
  }
);

async function exam() {
  // # Basic
  const _1 = await TestModel.findAll({
    attributes: ["foo", "bar"],
    raw: true,
  });
  console.log(_1);
  /*
  SELECT `foo`, `bar` 
  FROM `TestModel` AS `TestModel`;
  -> { foo: 'is Foo!', bar: 'is Bar!' }
  */

  // # AS
  const _2 = await TestModel.findAll({
    attributes: ["foo", ["bar", "baz"]],
    raw: true,
  });
  console.log(_2);
  /*
  SELECT `foo`, `bar` AS `baz` 
  FROM `TestModel` AS `TestModel`;
  -> { foo: 'is Foo!', baz: 'is Bar!' }
  */

  // # Aggregate Function
  const _3 = await TestModel.findAll({
    attributes: [[Sequelize.fn("COUNT", Sequelize.col("hats")), "hats count"]],
    raw: true,
  });
  console.log(_3);
  /*
  SELECT COUNT(`hats`) AS `hats count` 
  FROM `TestModel` AS `TestModel`;
  -> { 'hats count': 2 }
  */

  // # exclude field
  const _4 = await TestModel.findAll({
    attributes: { exclude: ["bar"] },
    raw: true,
  });
  console.log(_4);
  /*
  SELECT `id`, `foo`, `hats` FROM `TestModel` AS `TestModel`;
  -> { id: 1, foo: 'is Foo!', hats: 1 }
  */
}

sequelize.sync({ force: false }).then(async () => {
  console.log("[sequelize] table synchronizing success :)");

  await exam();
});
