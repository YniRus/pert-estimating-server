import { Response } from 'express'
import { CreateRoomRequest, GetRoomAccessUrlRequest } from '@/routes/definitions/room'
import { getRoomAccessUrl } from '@/utils/room'
import { createRoom, getRoomRaw } from '@/services/room'
import http from '@/utils/response/http'

export async function createRoomHandler(req: CreateRoomRequest, res: Response) {
    createRoom(req.body.pin)
        .then((room) => http(res).success({ accessUrl: getRoomAccessUrl(room) }))
        .catch((error: Error) => http(res).error(error))
}

export async function getRoomAccessUrlHandler(req: GetRoomAccessUrlRequest, res: Response) {
    if (res.locals.room.id !== req.query.roomId) return res.sendStatus(403)

    const room = await getRoomRaw(req.query.roomId)
    if (!room) return res.sendStatus(404)

    http(res).success({ accessUrl: getRoomAccessUrl(room) })
}
