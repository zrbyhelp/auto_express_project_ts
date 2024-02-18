import express, { NextFunction ,Request ,Response} from "express";
import { ServiceWhitelistControllers } from "../controllers/serviceWhitelistControllers";
const router = express.Router();
const serviceWhitelistControllers = new ServiceWhitelistControllers();

router.get("/",(req,res)=>{
    res.send(req.app.get("v").message);
});

export default router;
