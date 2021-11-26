const sequelize = require("../utils/defaultSequelize");
const { Model, DataTypes } = require("sequelize");

class ItemTag extends Model {}
ItemTag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tagId: {
      type: DataTypes.INTEGER,
      unique: "item_tag_taggable",
    },
    taggable: {
      type: DataTypes.STRING,
      unique: "item_tag_taggable",
    },
    taggableId: {
      type: DataTypes.INTEGER,
      unique: "item_tag_taggable",
      references: null,
    },
  },
  { sequelize, modelName: "item_tag" }
);
class Tag extends Model {}
Tag.init(
  { name: DataTypes.STRING, status: DataTypes.STRING },
  {
    sequelize,
    modelName: "tag",
  }
);

class Post extends Model {}
Post.init(
  {
    title: DataTypes.STRING,
    text: DataTypes.STRING,
  },
  { sequelize, modelName: "post" }
);

Post.belongsToMany(Tag, {
  through: {
    model: ItemTag,
    unique: false,
    scope: {
      taggable: "post",
    },
  },
  as: "pendingTags",
  foreignKey: "taggableId",
  constraints: false,
});
Tag.belongsToMany(Post, {
  through: {
    model: ItemTag,
    unique: false,
  },
  foreignKey: "tagId",
  constraints: false,
});

async function bulkInsertData() {
  const posts = Array.from({ length: 2 }, (_, k) => k).map((_) => ({
    title: `post ${_}`,
    text: `hello, it's post ${_}`,
  }));
  await Post.bulkCreate(posts);

  const tags = Array.from({ length: 10 }, (_, k) => k).map((_) => ({
    name: `tag ${_}`,
    status: `active`,
  }));
  await Tag.bulkCreate(tags);
}

async function exam() {
  const post = (await Post.findAll())[0];
  const tag = (await Tag.findAll())[0];
  await post.addPendingTag(tag);

  const pendingTags = await post.getPendingTags({
    raw: true,
  });
  console.log(pendingTags);
  /*
    {
        id: 1,
        title: 'post 0',
        text: "hello, it's post 0",
        createdAt: 2021-11-26T04:20:42.000Z,
        updatedAt: 2021-11-26T04:20:42.000Z,
        'item_tag.id': 1,
        'item_tag.tagId': 1,
        'item_tag.taggable': 'post',
        'item_tag.taggableId': 1,
        'item_tag.createdAt': 2021-11-26T04:20:42.000Z,
        'item_tag.updatedAt': 2021-11-26T04:20:42.000Z
    }
  */

  // # bad case
  const bad_post = (await Post.findAll())[1];
  const bad_tag = (await Tag.findAll())[1];
  await bad_tag.addPost(bad_post);

  const badTags = await bad_tag.getPosts({
    raw: true,
  });
  console.log(badTags);
  /*
    {
        id: 2,
        title: 'post 1',
        text: "hello, it's post 1",
        createdAt: 2021-11-26T04:20:42.000Z,
        updatedAt: 2021-11-26T04:20:42.000Z,
        'item_tag.id': 2,
        'item_tag.tagId': 1,
        'item_tag.taggable': null,
        'item_tag.taggableId': 2,
        'item_tag.createdAt': 2021-11-26T04:20:42.000Z,
        'item_tag.updatedAt': 2021-11-26T04:20:42.000Z
    }
  */
}

sequelize.sync({ force: true }).then(async () => {
  console.log("[database] connected :)");

  await bulkInsertData();
  await exam();
});
