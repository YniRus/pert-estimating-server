import { NextFunction, Request, Response } from 'express'
import { getRoomRaw } from '@/services/room'
import { RoomMiddlewareLocals } from '@http/definitions/response'
import { getStoragePin } from '@/utils/room'
import response from '@http/utils/response'

export default async function (req: Request, res: Response, next: NextFunction) {
    const roomId = req.query?.roomId || req.body?.roomId
    if (!roomId || typeof roomId !== 'string') return response(res).error(400, 'Invalid roomId')

    const room = await getRoomRaw(roomId)
    if (!room) return res.sendStatus(404)

    if (room.pin) {
        const pin = req.body.pin || req.query.pin

        if (!pin) return res.sendStatus(403)

        if (![pin, getStoragePin(pin, room.createdAt)].includes(room.pin)) {
            return response(res).error(400, 'Invalid pin')
        }
    }

    const locals: RoomMiddlewareLocals = { room }

    res.locals = { ...res.locals, ...locals }

    return next()
}
