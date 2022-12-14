import jwt from 'jsonwebtoken'
import config from 'config'

export function signJwt(object: Object, keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey', options?: jwt.SignOptions | undefined) {

    const signingKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii')
    return jwt.sign(
        object, 
        signingKey, 
        {...(options && options),
            algorithm: 'RS256'
        }
        )
}

export function verifyJWT<T>(token: string, keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey') : T | null {
    const signingKey = Buffer.from(config.get<string>(keyName), 'base64').toString('ascii');

    try {
        const decoded = jwt.verify(token, signingKey) as T
        return decoded
    } catch(err) {
        return null
    }
}