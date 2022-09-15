import { Router } from "express";
import { createUserHandler, forgotPasswordHandler, getCurrentUserHandler, resetPasswordHandler, verifyUserHandler } from "../controller/user.controller";
import requireUser from "../middleware/requireUser";
import { validate } from "../middleware/validateResource";
import { createUserSchema, forgotPasswordSchema, resetPasswordSchema, verifyUserSchema } from "../schema/user.schema";

const router = Router();

router.post('/api/users', validate(createUserSchema), createUserHandler)
router.post('/api/users/verify/:id/:verificationCode', validate(verifyUserSchema), verifyUserHandler)
router.post('/api/users/forgotpassword', validate(forgotPasswordSchema), forgotPasswordHandler)
router.post('/api/users/resetpassword/:id/:passwordResetCode', validate(resetPasswordSchema), resetPasswordHandler)

router.get('/api/users/me', requireUser, getCurrentUserHandler)

export default router;