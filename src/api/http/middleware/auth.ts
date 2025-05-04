import { NextFunction, Request } from 'express'
import useRoomService from '@/services/room'
import {
    getRequestAuthToken,
    getRequestAuthTokenPayload,
    isAuthTokenPayloadAccessAllowed,
    isValidAuthTokenPayload,
} from '@/utils/auth'
import { AuthMiddlewareLocals, BaseResponse } from '@http/definitions/response'
import { getServiceContext } from '@/utils/context'

export default async function (req: Request, res: BaseResponse, next: NextFunction) {
    const authToken = getRequestAuthToken(req)
    if (!authToken) return res.sendStatus(401)

    const authTokenPayload = getRequestAuthTokenPayload(authToken)
    if (!isValidAuthTokenPayload(authTokenPayload)) return res.sendStatus(400)

    const room = await useRoomService(getServiceContext(res)).getRoomRaw(authTokenPayload.room)
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
