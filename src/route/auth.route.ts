import { Router, Request, Response } from 'express'
import { createSessionHandler, refreshAccessTokenHandler } from '../controller/auth.controller';
import { validate } from '../middleware/validateResource';
import { createSessionSchema } from '../schema/auth.schema';

const router = Router();


router.post('/api/sessions', validate(createSessionSchema), createSessionHandler)
router.post('/api/sessions/refresh', refreshAccessTokenHandler)

export default router