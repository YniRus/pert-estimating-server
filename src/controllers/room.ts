import { Response } from 'express'
import { CreateRoomRequest, GetRoomRequest } from '@/routes/definitions/room'
import { getRoomAccessUrl } from '@/utils/room'
import { createRoom } from '@/services/room'
import { AuthResponse } from '@/definitions/response'
import { getUser } from '@/services/user'
import http from '@/utils/response/http'

export async function createRoomHandler(req: CreateRoomRequest, res: Response) {
    await createRoom(req.body.pin)
        .then((room) => http(res).success({ accessUrl: getRoomAccessUrl(room) }))
        .catch((error: Error) => http(res).error(error))
}

export async function getRoomHandler(req: GetRoomRequest, res: AuthResponse) {
    const room = res.locals.room
    const users = (await Promise.all(
        room.users.map(async (user) => await getUser(user)),
    )).filter(Boolean)

    const roomPublicData = {
        id: room.id,
        users,
    }

    http(res).success(roomPublicData)
}
