import { Model, Sequelize, DataTypes } from "sequelize";

class Project extends Model {
  public id!: number;
  public ownerId!: number;
  public name!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public static initConfig(sequelize: Sequelize) {
    Project.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          primaryKey: true,
          autoIncrement: true,
        },
        ownerId: {
          type: DataTypes.INTEGER.UNSIGNED,
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      { sequelize, modelName: "project" }
    );
  }
}

export default Project;
