import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class ServiceWhitelist extends Model{
    declare key: string;
}

ServiceWhitelist.init({
    host:{
        type: DataTypes.STRING,
        primaryKey:true
    },
    key: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    }
},{
    sequelize
})