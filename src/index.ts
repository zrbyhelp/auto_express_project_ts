require('express-async-errors');
import express from "express";
import path from 'path';
import fs from 'fs';
import winston from 'winston';
import expressWinston from 'express-winston';
import yaml from 'yaml';
import  {logger,errorLog}  from './log';

const app = express();

//读取配置文件,具体设置查阅配置文件
const configFilePath = path.join(__dirname, './public/config.yaml');
const fileContents = fs.readFileSync(configFilePath, 'utf8');
const config = yaml.parse(fileContents);
//设置端口
const port = config.port || 3000;
app.set('port', port);

//记录日志
app.use(
    expressWinston.logger({
      winstonInstance: logger,
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.json()
      ),
    })
);

app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`);
});