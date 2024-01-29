
import { NextFunction ,Request ,Response} from "express";
import  {logger,errorLog}  from './log';
/**
 * 通知型错误
 * 严重错误使用Error
 */
export class ZrError extends Error {
    constructor(message:string) {
      super(message);
      this.name = 'ZrError';
    }
    /**
     * 需要返回具体错误信息的error name列表
     */
    static sendError = [
      "ZrError",
      //Sequelize验证错误
      "SequelizeValidationError"
    ];
}
/**
 * 异常处理中间件
 * @param err 
 * @param req 
 * @param res 
 * @param next 
 */
export const errorUse = (err: any,req:Request,res:Response,next:NextFunction)=>{
  const environment = process.env.NODE_ENV || 'development';
  if(ZrError.sendError.includes(err.name) || environment==='development'){
    res.status(500).send(err.message);
  }else{
    errorLog.info(err.message);
    res.status(500).send("网络错误");
  }
}