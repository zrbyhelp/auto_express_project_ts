//异部错误转同步
require('express-async-errors');


import express, { NextFunction ,Request ,Response} from "express";
import  expressWinston,{logger,errorLog}  from './log';
import router from "./router";
import { versions } from "./version";
import config from './config';
import { initTableData, sequelize } from "./config/database";
import { User } from "./models/user";
import { UserController } from "./controllers/userControllers";

//清理控制台多余提醒
console.clear();
console.log("===程序输出=================================================");

//同步数据库
initTableData();

const app = express();

//记录日志
app.use(expressWinston());

//版本控制中间件
app.use(`/${config.name}/:version`, (req, res, next) => {
  const v = req.params.version;
  const foundVersion = versions.find(version => version.value === v);
  if (!foundVersion) {
      throw new Error("未找到符合条件的版本");
  }
  app.set("v",foundVersion);
  next();
});
//路由
app.use(`/${config.name}/:version`,router);

//错误处理中间件
app.use((err: any,req:Request,res:Response,next:NextFunction)=>{
  errorLog.info(err.message);
  res.status(500).send(err.message);
});

app.listen(config.port , () => {
    console.log("\x1b[32m%s\x1b[0m", `服务地址：http://127.0.0.1:${config.port}/${config.name}/${versions[versions.length-1].value}`);
});