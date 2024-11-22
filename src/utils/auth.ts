import { Request } from 'express'
import jwt from 'jsonwebtoken'
import { Room } from '@/definitions/room'
import { AuthTokenPayload } from '@/definitions/auth'

export function getAuthToken(payload: AuthTokenPayload) {
    return jwt.sign(payload, process.env.JWT_SECRET_KEY || '')
}

export function getRequestAuthToken<T extends { cookies: Request['cookies'] }>(req: T) {
    return req.cookies.authToken
}

export function getRequestAuthTokenPayload(authToken: string) {
    try {
        return jwt.verify(authToken, process.env.JWT_SECRET_KEY || '')
    } catch (e) { return e as jwt.VerifyErrors }
}

export function isValidAuthTokenPayload(payload: string | jwt.JwtPayload | jwt.VerifyErrors): payload is AuthTokenPayload {
    return typeof payload === 'object' && 'room' in payload && 'user' in payload
}

export function isAuthTokenPayloadAccessAllowed(payload: AuthTokenPayload, room: Room) {
    if (payload.room !== room.id) return false
    if (!room.users.includes(payload.user)) return false
    if (room.pin && payload.pin !== room.pin) return false

    return true
}
