import express, { NextFunction ,Request ,Response} from "express";
import { ServiceWhitelistControllers } from "../controllers/serviceWhitelistControllers";
import { KeyCommon } from "../unit";
const router = express.Router();
const serviceWhitelistControllers = new ServiceWhitelistControllers();

router.get("/add-service-whitelist",async (req,res)=>{
    res.send(await serviceWhitelistControllers.newAdd(req.query.host as string));
});

export default router;
