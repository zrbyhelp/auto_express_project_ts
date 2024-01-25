import { Sequelize } from 'sequelize';
import config from '.';
export const sequelize = new Sequelize(config.database,);
