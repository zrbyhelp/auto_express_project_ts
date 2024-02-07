import express, { NextFunction ,Request ,Response} from "express";
import { UserController } from "../controllers/userControllers";
import common from "./common";
import { Jwt } from "../unit";

const router = express.Router();
const userControllers = new UserController();
//鉴权测试代码
router.get("/",Jwt.authenticateToken,(req,res)=>{
    res.send(req.app.get("v").message);
});
router.use("/common",common);
//登陆并生成权限
router.post("/login",async (req,res)=>{
    const user = await userControllers.findUserByNameAndPassword(req.body.name,req.body.password);
    res.send({key:Jwt.sign(user.toJSON())});
});
export default router;