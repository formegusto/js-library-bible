const sequelize = require("../utils/defaultSequelize");
const { Model, DataTypes } = require("sequelize");

class Product extends Model {}
Product.init(
  {
    title: DataTypes.STRING,
  },
  { sequelize, modelName: "propduct" }
);
class User extends Model {}
User.init(
  {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    role: DataTypes.STRING,
  },
  { sequelize, modelName: "user" }
);

const Creator = Product.belongsTo(User, {
  as: "creator",
});
const CEO = Product.belongsTo(User, {
  as: "ceo",
});

async function exam() {
  const productByCEO = await Product.create(
    {
      title: "project by ceo",
      ceo: {
        firstName: "no",
        lastName: "th",
        role: "ceo",
      },
    },
    {
      include: [CEO],
    }
  );
  console.log(productByCEO.get({ plain: true }));

  const productByCreator = await Product.create(
    {
      title: "project by creator",
      creator: {
        firstName: "forme",
        lastName: "gusto",
        role: "creator",
      },
    },
    {
      include: [Creator],
    }
  );
  console.log(productByCreator.get({ plain: true }));

  console.log(await Product.findAll({ include: [CEO], raw: true }));
  console.log(await Product.findAll({ include: [Creator], raw: true }));
}

sequelize.sync({ force: true }).then(async () => {
  console.log("[database] connected :)");

  await exam();
});
