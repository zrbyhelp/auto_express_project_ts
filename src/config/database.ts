import { Sequelize } from 'sequelize';
import config from '.';
import { UserController } from '../controllers/userControllers';
import { errorLog } from '../log';
export const sequelize = new Sequelize(config.database,);
/**
 * 负责同步数据库与初始化数据操作
 */
export const initTableData=()=>{
    sequelize.sync({alter: true})
    //初始化数据
    .then(()=>new UserController().initCreateAdminUser())
    .catch((error) => {
        errorLog.info(error.message);
        throw new Error("数据库同步失败");
    });
}