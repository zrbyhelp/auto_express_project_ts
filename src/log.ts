import winston from 'winston';

const logFormat = winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`;
  });
export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      logFormat
    ),
    transports: [
      new winston.transports.File({
        filename: 'logs/info/' + new Date().toISOString().split('T')[0] + '.log',
        level: 'info',
        maxFiles: 14, // 最大文件数量，每个文件保存一天的日志
        tailable: true, // 启用循环日志
      }),
    ],
  });
export const errorLog =  winston.createLogger({
    level: 'info',
    format: winston.format.combine(
      winston.format.timestamp(),
      logFormat
    ),
    transports: [
      new winston.transports.File({
        filename: 'logs/error/' + new Date().toISOString().split('T')[0] + '.log',
        level: 'info',
      }),
    ],
  });