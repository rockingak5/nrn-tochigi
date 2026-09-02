import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import { sequelize } from '../sequelize';

export class HomeSettings extends Model<InferAttributes<HomeSettings>, InferCreationAttributes<HomeSettings>> {
  declare id: CreationOptional<number>;
  declare heroImageUrl: CreationOptional<string | null>;
  declare activitiesImageUrl: CreationOptional<string | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

HomeSettings.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    heroImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    activitiesImageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'home_settings',
    modelName: 'HomeSettings',
  },
);

export default HomeSettings;
