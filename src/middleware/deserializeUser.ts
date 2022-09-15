import { NextFunction, Request, Response } from "express";
import { identity } from "lodash";
import { verifyJWT } from "../util/jwt";

export default function deserializeUser(req: Request, res: Response, next: NextFunction) {
    const accessToken = (req.headers.authorization || '').replace(/Bearer\s/, '');
    if(!accessToken) return next();

    const decoded = verifyJWT(accessToken, 'accessTokenPublicKey');

    if(decoded) {
        res.locals.user = decoded
    }

    return next()
}