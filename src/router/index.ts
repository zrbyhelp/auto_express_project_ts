import express, { NextFunction ,Request ,Response} from "express";
import { UserController } from "../controllers/userControllers";
import common from "./common";
import { Jwt } from "../unit";
import service from "./service";
import menu from "./menu";

const router = express.Router();
const userControllers = new UserController();
router.use("/common",common);
router.use("/service",service);
router.use("/menu",menu);
//登陆并生成权限
router.post("/login",async (req,res)=>{
    const user = await userControllers.findUserByNameAndPassword(req.body.name,req.body.password);
    res.send({key:Jwt.sign(user.toJSON())});
});
export default router;