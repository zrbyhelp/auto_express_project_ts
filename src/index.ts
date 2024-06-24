//异部错误转同步
require('express-async-errors');

import * as Sentry from "@sentry/node";
import { ProfilingIntegration } from "@sentry/profiling-node";
import express, { NextFunction ,Request ,Response} from "express";
import router from "./router";
import { versions } from "./version";
import config from './config';
import { sequelize } from "./config/database";
import {  ZrError, errorUse } from "./zrError";
import { WebSocketServer } from "./web-socket";

//清理控制台多余提醒
console.clear();
console.log("===程序输出=================================================");

//同步数据库
sequelize.sync({alter: true}).catch((error) => {
    throw new Error("数据库同步失败");
});

const app = express();

//注册哨兵
Sentry.init({
  dsn: config.sentryDsn,
  //过滤上报的异常信息
  ignoreErrors: [
    "top.GLOBALS",
    "originalCreateNotification",
    "canvas.contentDocument",
    "MyApp_RemoveAllHighlights",
    "http://tt.epicplay.com",
    "Can't find variable: ZiteReader",
    "jigsaw is not defined",
    "ComboSearch is not defined",
    "http://loading.retry.widdit.com/",
    "atomicFindClose",
    "fb_xd_fragment",
    "bmi_SafeAddOnload",
    "EBCallBackMessageReceived",
    "conduitPage",
    ...ZrError.sendError
  ],
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Sentry.Integrations.Express({ app }),
    new ProfilingIntegration(),
  ],
  tracesSampleRate: 1.0, 
  profilesSampleRate: 1.0,
});

//请求处理程序必须是应用程序上的第一个中间件
app.use(Sentry.Handlers.requestHandler());
//TracingHandler为每个传入请求创建跟踪
app.use(Sentry.Handlers.tracingHandler());
//初始化json
app.use(express.json());
//注册WebSocket
WebSocketServer.getInstance(app);

//版本控制中间件
app.use(`/${config.name}/:version`, (req, res, next) => {
  const v = req.params.version;
  const foundVersion = versions.find(version => version.value === v);
  if (!foundVersion) {
      throw new ZrError("未找到符合条件的版本");
  }
  app.set("v",foundVersion);
  next();
});

//路由
app.use(`/${config.name}/:version`,router);

//错误处理程序必须在任何其他错误中间件之前和所有控制器之后注册
app.use(Sentry.Handlers.errorHandler());
//错误处理中间件
app.use(errorUse);

app.listen(config.port , () => {
    console.log("\x1b[32m%s\x1b[0m", `服务地址：http://127.0.0.1:${config.port}/${config.name}/${versions[versions.length-1].value}`);
});