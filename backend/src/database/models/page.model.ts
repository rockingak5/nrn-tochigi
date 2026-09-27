import { DataTypes, Model, type InferAttributes, type InferCreationAttributes, type CreationOptional } from 'sequelize';
import { sequelize } from '../sequelize';

export class Page extends Model<InferAttributes<Page>, InferCreationAttributes<Page>> {
  declare id: CreationOptional<number>;
  declare slug: string;
  declare title: string;
  declare imageUrl: CreationOptional<string | null>;
  declare body: CreationOptional<string>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Page.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    body: {
      // Note: no `defaultValue` here. MySQL (unlike MariaDB) rejects a
      // DEFAULT clause on TEXT/BLOB/GEOMETRY/JSON columns, which made
      // sequelize.sync() fail with "BLOB, TEXT, GEOMETRY or JSON column
      // 'body' can't have a default value". The '' default is applied in
      // JS via the beforeValidate hook below instead.
      type: DataTypes.TEXT('long'),
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'pages',
    modelName: 'Page',
    hooks: {
      beforeValidate: (page) => {
        if (page.body === undefined || page.body === null) {
          page.body = '';
        }
      },
    },
  },
);

export default Page;
