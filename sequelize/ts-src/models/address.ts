import {
  Model,
  Sequelize,
  DataTypes,
  BelongsToGetAssociationMixin,
  BelongsToSetAssociationMixin,
  Association,
} from "sequelize";
import User from "./user";

class Address extends Model {
  public userId!: number;
  public address!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public getUser!: BelongsToGetAssociationMixin<User>;
  public setUser!: BelongsToSetAssociationMixin<User, number>;

  public readonly user?: User;

  public static associations: {
    user: Association<Address, User>;
  };

  public static initConfig(sequelize: Sequelize) {
    Address.init(
      {
        userId: {
          type: DataTypes.INTEGER.UNSIGNED,
        },
        address: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      { sequelize, modelName: "address" }
    );
  }

  public static associationConfig() {
    Address.belongsTo(User, {
      targetKey: "id",
    });
  }
}

export default Address;
