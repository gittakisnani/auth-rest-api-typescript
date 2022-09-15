import { DocumentType } from "@typegoose/typegoose";
import sessionModel from "../model/session.model";
import { User } from "../model/user.model";
import { signJwt } from "../util/jwt";

export function signAccessToken(user: DocumentType<User>) {
    const payload = user.toJSON();

    const accessToken = signJwt(payload, 'accessTokenPrivateKey', { expiresIn: '15m'})

    return accessToken
}

export async function signRefreshToken({ userId }: { userId: string }) {
    const session = await createSession(userId);

    const refreshToken = signJwt({ session: session._id }, 'refreshTokenPrivateKey', { expiresIn: '1y'});

    return refreshToken
}

export async function createSession(userId: string) {
    return sessionModel.create({ user: userId })
}

export async function findSessionById(id: string) {
    return sessionModel.findById(id)
}