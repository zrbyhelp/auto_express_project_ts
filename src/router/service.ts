import express, { NextFunction ,Request ,Response} from "express";
import { ServiceWhitelistControllers } from "../controllers/serviceWhitelistControllers";
import { Jwt,KeyCommon, UnitCommon } from "../unit";
import crypto from "crypto"
import path from "path";
const router = express.Router();
const serviceWhitelistControllers = new ServiceWhitelistControllers();

router.get("/add-service-whitelist",Jwt.authenticateToken,async (req,res)=>{
    res.send(await serviceWhitelistControllers.newAdd(req.query.host as string));
});
router.post("/test-post",async (req,res)=>{
    const aesKey = crypto.randomBytes(32).toString('base64');
    const key = UnitCommon.readFromFile(path.join(KeyCommon.keyFile,`host.pem`))
    const data = KeyCommon.clientCrypt(key,{type:"ok"},aesKey);
    res.send(data);
});
router.post("/service-test",KeyCommon.authenticate,async (req,res)=>{
    KeyCommon.serviceSend({type:"ok",data:req.body},req,res);
});
export default router;
