import { NextFunction, Request, Response } from 'express'
import { AnyZodObject } from 'zod'
import logger from '../util/logger'

export const validate = (schema: AnyZodObject) => 
(req: Request, res: Response, next: NextFunction) => {
    try {
        schema.parse({
            body: req.body,
            params: req.params,
            query: req.query
        })

        next()
    } catch(err: any) {
        logger.error(err)
        res.status(400).json(err.errors)
    }
}