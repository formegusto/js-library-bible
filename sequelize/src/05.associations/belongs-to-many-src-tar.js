const sequelize = require("../utils/defaultSequelize");
const { Model, DataTypes } = require("sequelize");

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: "user_id",
    },
    userSecondId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      field: "user_second_id",
    },
  },
  {
    tableName: "tbl_user",
    indexes: [
      {
        unique: true,
        fields: ["user_second_id"],
      },
    ],
  }
);

const Group = sequelize.define(
  "Group",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: "group_id",
    },
    groupSecondId: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      field: "group_second_id",
    },
  },
  {
    tableName: "tbl_group",
    indexes: [
      {
        unique: true,
        fields: ["group_second_id"],
      },
    ],
  }
);

User.belongsToMany(Group, {
  through: "usergroups",
  sourceKey: "userSecondId",
});
Group.belongsToMany(User, {
  through: "usergroups",
  sourceKey: "groupSecondId",
});

sequelize.sync({ force: false }).then(() => {
  console.log("[database] table synchronizing success :)");
});
