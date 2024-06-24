import express, { NextFunction ,Request ,Response} from "express";
import { MenuControllers } from "../controllers/menuControllers";
const router = express.Router();
const menuControllers =new MenuControllers();
router.get("/",async (req,res)=>{
    const list = await menuControllers.findAll();
    res.json(list);
});
router.post("/add",async (req,res)=>{
    const menu = await menuControllers.create(req.body.fid,req.body.key,req.body.type,req.body.name);
    res.json(menu);
});
router.post("/del",async (req,res)=>{
    await menuControllers.del(req.body.id);
    res.send();
});
router.post("/update",async (req,res)=>{
    await menuControllers.update(req.body.id,req.body.fid,req.body.key,req.body.type,req.body.name);
    res.send();
});
export default router;
