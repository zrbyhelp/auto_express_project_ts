import express, { NextFunction ,Request ,Response} from "express";
import { UserController } from "../controllers/userControllers";
import common from "./common";

const router = express.Router();
const userControllers = new UserController();
router.get("/",(req,res)=>{
    res.send(req.app.get("v").message);
});
router.use("/common",common);

router.get("/userCount",async (req,res)=>{
    res.send({count:await userControllers.userCount()});
});
export default router;