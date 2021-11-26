const sequelize = require("../utils/defaultSequelize");
const { Model, DataTypes } = require("sequelize");

class Tag extends Model {}
Tag.init(
  {
    name: DataTypes.STRING,
  },
  { sequelize, modelName: "tag" }
);
class Product extends Model {}
Product.init(
  {
    title: DataTypes.STRING,
  },
  { sequelize, modelName: "pruduct" }
);

Product.hasMany(Tag);
const Categories = Product.hasMany(Tag, { as: "categories" });

async function exam() {
  await Product.create(
    {
      id: 1,
      title: "Chair",
      tags: [
        {
          name: "Alpha",
        },
        {
          name: "Beta",
        },
      ],
    },
    {
      include: [Tag],
    }
  );

  await Product.create(
    {
      id: 2,
      title: "formegusto",
      categories: [
        {
          name: "dance",
        },
        {
          name: "boy",
        },
      ],
    },
    {
      include: [
        {
          association: Categories,
          as: "categories",
        },
      ],
    }
  );

  const productsWithCats = await Product.findAll({ include: [Categories] });
  console.log(
    productsWithCats[0].categories[0].get({
      plain: true,
    })
  );

  const productWithTags = await Product.findAll({ include: [Tag] });
  console.log(
    productWithTags[0].tags[0].get({
      plain: true,
    })
  );
}

sequelize.sync({ force: true }).then(async () => {
  console.log("[database] connected :)");

  await exam();
});
