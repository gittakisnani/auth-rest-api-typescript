import { Response, Request, NextFunction } from "express";

export default function requireUser(req: Request, res: Response, next: NextFunction) {
    const user = res.locals.user;

    if(!user) return res.status(403).send('User required')

    next()
}