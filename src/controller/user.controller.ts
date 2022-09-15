import { Response, Request } from "express";
import { omit } from "lodash";
import { v4 } from "uuid";
import { privateFields } from "../model/user.model";
import { CreateUserInput, ForgotPasswordInput, ResetPasswordInput, VerifyUserInput } from "../schema/user.schema";
import { createUser, findUserByEmail, findUserById } from "../service/user.service";
import logger from "../util/logger";
import sendEmail from "../util/mailer";

async function createUserHandler(req:Request<{}, {}, CreateUserInput>, res: Response) {
    try{
        const user = await createUser(req.body);
        if(!user) return res.sendStatus(500).json({ message: 'Cannot create new user'})
        await sendEmail({
            from: 'test@example.com',
            to: user.email,
            subject: 'Please verify your email',
            text: `Verification Code: ${user.verificationCode}. id: ${user._id}`
        })

    res.status(201).json(omit(user.toJSON(), privateFields))
    } catch(err: any) {
        if (err.code === 11000) return res.status(403).send('Email is already registered')

        res.sendStatus(500)
    }
}

async function verifyUserHandler(req: Request<VerifyUserInput>, res: Response) {
    const { id, verificationCode } = req.params;
    //Find user by id
    const user = await findUserById(id);
    if(!user) return res.status(400).send('Canoot verify user')
    //Check if he is already verified
    if(user.verified) return res.status(400).json({ message: 'User is already verified'})
    //check if verificationCode matches
    if(user.verificationCode === verificationCode) {
        user.verified = true;

        await user.save();

        return res.status(200).send('User verified successfully')
    }

    return res.status(400).json({ message: 'Could not verify User'})
}

async function forgotPasswordHandler(req: Request<{}, {}, ForgotPasswordInput>, res: Response) {
    const { email } = req.body
    const message = 'If a user with tha email is registered you will receive a password reset email'
    const user = await findUserByEmail(email);
    if(!user) {
        logger.debug(`User with Email: ${email} does not exist`)
        return res.status(400).json(message)
    }

    if(!user.verified) return res.status(400).send('User not verified')

    const passwordResetCode = v4();

    user.resetPassword = passwordResetCode;

    await user.save()

    await sendEmail({
        to: user.email,
        from: 'test@example.com',
        subject: 'Reset password',
        text: `Reset Code: ${passwordResetCode}. id: ${user._id}`
    })

    logger.debug('Password reset email sent')

    return res.status(200).json(message)
}


async function resetPasswordHandler(req: Request<ResetPasswordInput['params'], {}, ResetPasswordInput['body']>, res: Response) {
    const { id, passwordResetCode } = req.params
    const { password } = req.body


    const user = await findUserById(id);

    if(!user || !user.resetPassword || user.resetPassword !== passwordResetCode) return res.status(400).send('Could not reset user password')


    user.resetPassword = null;

    user.password = password;

    await user.save();

    return res.status(200).json({ message: 'Successfully Reset user password'})
}

async function getCurrentUserHandler(req: Request, res: Response) {
    return res.send(omit(res.locals.user, privateFields))
}

export {
    createUserHandler,
    verifyUserHandler,
    forgotPasswordHandler,
    resetPasswordHandler,
    getCurrentUserHandler
}