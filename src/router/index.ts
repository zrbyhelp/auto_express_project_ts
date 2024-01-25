import express, { NextFunction ,Request ,Response} from "express";
import { User } from "../models/user";

const router = express.Router();
router.get("/",(req,res)=>{
    res.send(User.findAll());
    res.send(req.app.get("v").message);
});

export default router;