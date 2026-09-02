import 'dotenv/config';
import { Sequelize } from 'sequelize';
const configs = require('./config/config');

type Env = 'development' | 'test' | 'production';

const env = (process.env.NODE_ENV as Env) || 'development';
const config = (configs as Record<Env, any>)[env];

export const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config,
);
