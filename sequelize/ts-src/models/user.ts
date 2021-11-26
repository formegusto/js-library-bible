import {
  Model,
  Sequelize,
  DataTypes,
  Association,
  HasManyGetAssociationsMixin,
  HasManyAddAssociationsMixin,
  HasManyHasAssociationMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
} from "sequelize";
import Address from "./address";
import Project from "./project";

class User extends Model {
  public id!: number;
  public name!: string;
  public preferredName!: string | null;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedat!: Date;

  // association func
  public getProjects!: HasManyGetAssociationsMixin<Project>;
  public addProject!: HasManyAddAssociationsMixin<Project, number>;
  public hasProject!: HasManyHasAssociationMixin<Project, number>;
  public countProjects!: HasManyCountAssociationsMixin;
  public createProject!: HasManyCreateAssociationMixin<Project>;

  public getAddress!: HasOneGetAssociationMixin<Address>;
  public setAddress!: HasOneSetAssociationMixin<Address, number>;

  public readonly projects?: Project[];
  public readonly address?: Address;

  // association
  public static associations: {
    projects: Association<User, Project>;
    address: Association<User, Address>;
  };

  public static initConfig(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.INTEGER.UNSIGNED,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        preferredName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      { sequelize, modelName: "user" }
    );
  }

  public static associationsConfig() {
    User.hasMany(Project, {
      sourceKey: "id",
      foreignKey: "ownerId",
      as: "projects",
    });
    User.hasOne(Address, {
      sourceKey: "id",
      foreignKey: "userId",
      as: "address",
    });
  }
}

export default User;
