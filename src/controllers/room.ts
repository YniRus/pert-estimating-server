import { Response } from 'express'
import { CreateRoomRequest, GetRoomRequest } from '@/routes/definitions/room'
import { requestError } from '@/utils/response'
import { getRoomAccessUrl } from '@/utils/room'
import { createRoom } from '@/services/room'
import { AuthResponse } from '@/definitions/response'
import { getUser } from '@/services/user'

export async function createRoomHandler(req: CreateRoomRequest, res: Response) {
    await createRoom(req.body.pin)
        .then((room) => res.status(200).json({ accessUrl: getRoomAccessUrl(room) }))
        .catch((error: Error) => res.status(500).json(requestError(error)))
}

export async function getRoomHandler(req: GetRoomRequest, res: AuthResponse) {
    const room = res.locals.room
    const users = (await Promise.all(
        room.users.map(async (user) => await getUser(user)),
    )).filter(Boolean)

    const roomPublicData = {
        uid: room.uid,
        users,
    }

    res.status(200).json(roomPublicData)
}
