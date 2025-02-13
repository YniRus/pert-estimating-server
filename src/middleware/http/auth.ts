import { NextFunction, Request, Response } from 'express'
import { getRoomRaw } from '@/services/room'
import {
    getRequestAuthToken,
    getRequestAuthTokenPayload,
    isAuthTokenPayloadAccessAllowed,
    isValidAuthTokenPayload,
} from '@/utils/auth'
import { AuthMiddlewareLocals } from '@/definitions/response'

export default async function (req: Request, res: Response, next: NextFunction) {
    const authToken = getRequestAuthToken(req)
    if (!authToken) return res.sendStatus(401)

    const authTokenPayload = getRequestAuthTokenPayload(authToken)
    if (!isValidAuthTokenPayload(authTokenPayload)) return res.sendStatus(400)

    const room = await getRoomRaw(authTokenPayload.room)
    if (!room) return res.sendStatus(404)

    if (!isAuthTokenPayloadAccessAllowed(authTokenPayload, room)) return res.sendStatus(403)

    const locals: AuthMiddlewareLocals = {
        authToken,
        authTokenPayload,
        room,
    }

    res.locals = { ...res.locals, ...locals }

    return next()
}
