"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('express-async-errors');
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const winston_1 = __importDefault(require("winston"));
const express_winston_1 = __importDefault(require("express-winston"));
const yaml_1 = __importDefault(require("yaml"));
const log_1 = require("./log");
const app = (0, express_1.default)();
//读取配置文件,具体设置查阅配置文件
const configFilePath = path_1.default.join(__dirname, './public/config.yaml');
const fileContents = fs_1.default.readFileSync(configFilePath, 'utf8');
const config = yaml_1.default.parse(fileContents);
//设置端口
const port = config.port || 3000;
app.set('port', port);
//记录日志
app.use(express_winston_1.default.logger({
    winstonInstance: log_1.logger,
    format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.json()),
}));
app.listen(port, () => {
    console.log(`http://127.0.0.1:${port}`);
});
