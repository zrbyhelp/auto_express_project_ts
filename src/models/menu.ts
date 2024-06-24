import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { ZrError } from "../zrError";

export class Menu extends Model {
}
Menu.init({
    // 在这里定义模型属性
    id: {
      type: DataTypes.UUID,
      primaryKey:true,
      defaultValue: DataTypes.UUIDV4,
    },    // 在这里定义模型属性
    fid: {
      type: DataTypes.UUID,
      defaultValue: null,
      allowNull: true, 
      validate:{
        async customValidator(value:string) {
            if(this.type === 'page' && value){
              const list = await Menu.findAll({
                where:{
                  id:value,
                  type:"menu"
                }
              });
              if(list.length===0){
                throw new ZrError('父级id不存在');
              }
            }
            if (this.type === 'fun') {

              if(!value){
                throw new ZrError('父级id不能为空');
              }

              const list = await Menu.findAll({
                where:{
                  id:value,
                  type:"page"
                }
              });
              if(list.length===0){
                throw new ZrError('父级id不存在');
              }


            }
          }
      },
    },
    key: {
        type: DataTypes.STRING,
        defaultValue: null,
        allowNull: true, 
        validate:{
            isEven(value: string) {
                if ((this.type === 'page' || this.type === 'fun') && !value) {
                    throw new ZrError('key不能为空');
                }
              }
        }
      },
    type:{
      type: DataTypes.STRING,
      defaultValue: 'default',
      allowNull: false,
      validate: {
        isIn: {
          args: [['menu', 'page','fun']],
          msg: "类型错误"
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
            msg:"不允许空字符串"
          }
      }
    }
  }, {
    sequelize
});
// Menu.sync({ alter: true }).then(()=>{})