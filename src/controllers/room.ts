import { Response } from 'express'
import { CreateRoomRequest } from '@/routes/definitions/room'
import { getRoomAccessUrl } from '@/utils/room'
import { createRoom } from '@/services/room'
import http from '@/utils/response/http'

export async function createRoomHandler(req: CreateRoomRequest, res: Response) {
    await createRoom(req.body.pin)
        .then((room) => http(res).success({ accessUrl: getRoomAccessUrl(room) }))
        .catch((error: Error) => http(res).error(error))
}
