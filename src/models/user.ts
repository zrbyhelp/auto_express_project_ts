import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import crypto from 'crypto';
export class User extends Model {
    //生成加盐sha256密码
    createPassword(value:string){
        if(value.length>32||value.length<6)throw new Error("密码长度过短");
        return crypto.createHash('sha256').update(this.getDataValue('name') + value).digest('hex');
    }
    /**
     * 验证密码有效性
     */
    comparePassword(password:string) {
        return this.getDataValue('password') === this.createPassword(password);
    }
}

User.init({
    // 在这里定义模型属性
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey:true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isAlphanumeric:{
            msg:"只允许字母或数字"
        }
      }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg:"不允许空字符串"
          }
        },
        set(value:string) {
            this.setDataValue('password', this.createPassword(value));
        },
    }
  }, {
    sequelize
});
