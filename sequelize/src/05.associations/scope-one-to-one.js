const sequelize = require("../utils/defaultSequelize");
const { Model, DataTypes } = require("sequelize");

class Post extends Model {}
Post.init(
  {
    title: DataTypes.STRING,
    text: DataTypes.STRING,
  },
  { sequelize, modelName: "post" }
);
class Image extends Model {}
Image.init(
  {
    title: DataTypes.STRING,
    link: DataTypes.STRING,
  },
  { sequelize, modelName: "image" }
);
class Comment extends Model {
  getItem(options) {
    return this[
      "get" +
        this.get("commentable")[0].toUpperCase() +
        this.get("commentable").substr(1)
    ](options);
  }
}
Comment.init(
  {
    title: DataTypes.STRING,
    commentable: DataTypes.STRING,
    commentableId: DataTypes.INTEGER,
  },
  { sequelize, modelName: "comment" }
);
Post.hasMany(Comment, {
  foreignKey: "commentableId",
  constraints: false,
  scope: {
    commentable: "post",
  },
});
Comment.belongsTo(Post, {
  foreignKey: "commentableId",
  constraints: false,
  as: "post",
});
Image.hasMany(Comment, {
  foreignKey: "commentableId",
  constraints: false,
  scope: {
    commentable: "image",
  },
});
Comment.belongsTo(Image, {
  foreignKey: "commentableId",
  constraints: false,
  as: "image",
});

async function exam() {
  const image = await Image.create();

  await image.getComments();
  /*
  SELECT `id`, `title`, `commentable`, `commentableId`, 
  `createdAt`, `updatedAt` 
  FROM `comments` AS `comment` 
  WHERE `comment`.`commentable` = 'image' 
  AND `comment`.`commentableId` = 1;
  */
  const comment = await image.createComment();
  console.log(
    "get" +
      comment.get("commentable")[0].toUpperCase() +
      comment.get("commentable").substr(1)
  ); // getImage
  await image.addComment(comment);

  await comment.getImage();
  /*
  SELECT * 
  FROM `images` AS `image` 
  WHERE `image`.`id` = 1;
  */
  await comment.getPost();
  /*
  SELECT *
  FROM `posts` AS `post` 
  WHERE `post`.`id` = 1;
  */
  await comment.getItem();
  /*
  SELECT *
  FROM `images` AS `image` 
  WHERE `image`.`id` = 1;
  */
}

sequelize.sync({ force: true }).then(async () => {
  console.log("[database] Connected :)");

  await exam();
});
