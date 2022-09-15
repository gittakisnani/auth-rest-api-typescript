import { Router, Request, Response } from "express";
import userRouter from './user.route'
import authRouter from './auth.route'
const router = Router();

router.get('/healthcheck', (req: Request, res: Response) => {
    res.sendStatus(200)
})


export {
    userRouter,
    authRouter
}


export default router