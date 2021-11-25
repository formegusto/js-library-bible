const { Sequelize } = require("sequelize");
const sequelize = require("../utils/defaultSequelize");

class User extends Sequelize.Model {}
class Post extends Sequelize.Model {}

const postAttributes = {
  title: {
    type: Sequelize.STRING,
    defaultValue: "untitle",
    allowNull: false,
  },
  contents: {
    type: Sequelize.TEXT,
    defaultValue: "글을 입력해주세요.",
    allowNull: false,
  },
  status: {
    type: Sequelize.ENUM("active", "unactive"),
    defaultValue: "active",
    allowNull: false,
  },
};
const userAttributes = {
  username: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

User.init(userAttributes, {
  modelName: "User",
  freezeTableName: true,
  sequelize,
});
Post.init(postAttributes, {
  modelName: "Post",
  freezeTableName: true,
  sequelize,
});

User.hasMany(Post, { foreignKey: "authorId" });
Post.belongsTo(User, { foreignKey: "authorId" });

async function exam() {
  const Op = Sequelize.Op;

  const _1 = await Post.findAll({
    where: {
      authorId: 1,
    },
  });
  /*
  SELECT `id`, `title`, `contents`, `status`, 
  `createdAt`, `updatedAt`, `authorId` 
  FROM `Post` AS `Post` 
  WHERE `Post`.`authorId` = 1;
  */

  const _2 = await Post.findAll({
    where: {
      authorId: 1,
      status: "active",
    },
  });
  /*
  SELECT `id`, `title`, `contents`, `status`, 
  `createdAt`, `updatedAt`, `authorId` FROM `Post` AS `Post` 
  WHERE `Post`.`authorId` = 1 
  AND `Post`.`status` = 'active';
  */

  const _3 = await Post.findAll({
    where: {
      [Op.or]: [{ authorId: 1 }, { authorId: 2 }],
    },
  });
  const _3_2 = await Post.findAll({
    where: {
      authorId: {
        [Op.or]: [1, 2],
      },
    },
  });
  /*
  SELECT `id`, `title`, `contents`, `status`, 
  `createdAt`, `updatedAt`, `authorId` 
  FROM `Post` AS `Post` 
  WHERE (`Post`.`authorId` = 1 
  OR `Post`.`authorId` = 2);
  */

  const _4 = await Post.destroy({
    where: {
      id: {
        [Op.gt]: 10,
      },
    },
  });
  /*
  SELECT `id`, `title`, `contents`, `status`, 
  `createdAt`, `updatedAt`, `authorId` 
  FROM `Post` AS `Post` 
  WHERE (`Post`.`authorId` = 1 
  OR `Post`.`authorId` = 2);
  */

  const _5 = await Post.update(
    {
      title: "반갑습니다!",
    },
    {
      where: {
        id: {
          [Op.gt]: 1,
        },
      },
    }
  );
  /*
  UPDATE `Post` SET `title`=?,`updatedAt`=? WHERE `id` > 1
  */

  const _6 = await Post.findAll({
    where: sequelize.where(
      sequelize.fn("char_length", sequelize.col("status")),
      6
    ),
  });
  /*
  SELECT `id`, `title`, `contents`, `status`, 
  `createdAt`, `updatedAt`, `authorId` 
  FROM `Post` AS `Post` 
  WHERE char_length(`status`) = 6;
   */
}

sequelize.sync({ force: false }).then(async () => {
  console.log("[sequelize] table synchronizing success :)");

  await exam();
});
