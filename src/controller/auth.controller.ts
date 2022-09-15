import { Request, Response } from "express";
import { get } from "lodash";
import { CreateSessionType } from "../schema/auth.schema";
import { findSessionById, signAccessToken, signRefreshToken } from "../service/auth.service";
import { findUserByEmail, findUserById } from "../service/user.service";
import { verifyJWT } from "../util/jwt";

async function createSessionHandler(req: Request<{}, {}, CreateSessionType>, res: Response) {
    const { email, password } = req.body;
    const message = 'Invalid credentials'
    const user = await findUserByEmail(email);

    if(!user) return res.status(404).json(message)

    if(!user.verified) return res.status(400).json({ message: 'Please verify your email'})

    const isValid = await user.validatePassword(password);

    if(!isValid) return res.status(400).json({ message });

    //Sign access token

    const accessToken = signAccessToken(user)

    //Sign refresh token

    const refreshToken = await signRefreshToken({ userId: user._id })

    return res.status(201).json({ accessToken, refreshToken })
}

async function refreshAccessTokenHandler(req: Request, res: Response) {
    const refreshToken = get(req, 'headers.x-refresh');

    const decoded = verifyJWT<{ session: string }>(refreshToken, 'refreshTokenPublicKey');

    if(!decoded) {
        return res.status(401).json({ message: 'Cannot refresh accessToken'})
    }

    const session = await findSessionById(decoded.session)

    if(!session || !session.valid) {
        res.status(401).json({ message: 'Cannot refresh accessToken '})
    }

    const user = await findUserById(String(session?.user));

    if(!user) return res.status(401).json({ message: 'Cannot refresh accessToken'})

    const accessToken = signAccessToken(user);

    return res.send({ accessToken })
}
export { createSessionHandler, refreshAccessTokenHandler}