import { Response } from 'express'
import { CreateRoomRequest, GetRoomAccessUrlRequest } from '@http/routes/definitions/room'
import { getRoomAccessUrl } from '@/utils/room'
import { createRoom, getRoomRaw } from '@/services/room'
import response from '@http/utils/response'

export async function createRoomHandler(req: CreateRoomRequest, res: Response) {
    createRoom(req.body.pin)
        .then((room) => response(res).success({ accessUrl: getRoomAccessUrl(room) }))
        .catch((error: Error) => response(res).error(error))
}

export async function getRoomAccessUrlHandler(req: GetRoomAccessUrlRequest, res: Response) {
    if (res.locals.room.id !== req.query.roomId) return res.sendStatus(403)

    const room = await getRoomRaw(req.query.roomId)
    if (!room) return res.sendStatus(404)

    response(res).success({ accessUrl: getRoomAccessUrl(room) })
}
