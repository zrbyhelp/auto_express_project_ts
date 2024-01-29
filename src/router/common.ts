import express, { NextFunction ,Request ,Response} from "express";
import { ZrError } from "../zrError";
import { SentryControllers } from "../controllers/sentryControllers";
const router = express.Router();

router.get("/user_feedback",(req,res)=>{
    SentryControllers.sendUserFeedback(
        req.query.name as string,
        req.query.email as string,
        req.query.comments as string)
    res.send();
});

export default router;
