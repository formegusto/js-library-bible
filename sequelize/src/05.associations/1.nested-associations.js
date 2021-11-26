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
  },
  { sequelize, modelName: "user" }
);
class Address extends Model {}
Address.init(
  {
    type: DataTypes.STRING,
    line1: DataTypes.STRING,
    line2: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
  },
  { sequelize, modelName: "address" }
);

Product.User = Product.belongsTo(User);
User.Addresses = User.hasMany(Address);
// Also works for `hasOne`

async function exam() {
  await Product.create(
    {
      title: "Chair",
      user: {
        firstName: "Mick",
        lastName: "Broadstone",
        addresses: [
          {
            type: "home",
            line1: "100 Main St.",
            city: "Austin",
            state: "TX",
            zip: "78704",
          },
        ],
      },
    },
    {
      include: [
        {
          association: Product.User,
          include: [User.Addresses],
        },
      ],
    }
  );

  const product = await Product.findOne({
    where: {
      title: "Chair",
    },
    include: [
      {
        association: Product.User,
        include: [User.Addresses],
        // ==
        // model: User,
        // include: [
        //   {
        //     model: Address,
        //   },
        // ],
      },
    ],
  });
  console.log(product.get({ plain: true }));
  /*
    {
        id: 1,
        title: 'Chair',
        createdAt: 2021-11-26T04:49:39.000Z,
        updatedAt: 2021-11-26T04:49:39.000Z,
        userId: 1,
        user: {
            id: 1,
            firstName: 'Mick',
            lastName: 'Broadstone',
            createdAt: 2021-11-26T04:49:39.000Z,
            updatedAt: 2021-11-26T04:49:39.000Z,
            addresses: [ [Object] ]
        }
    }
  */
}

sequelize.sync({ force: true }).then(async () => {
  await exam();
});
