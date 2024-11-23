import { Response } from 'express'
import { getStoragePin } from '@/utils/room'
import { getRoom, joinRoom, leaveRoom } from '@/services/room'
import { LoginRequest, LogoutRequest } from '@/routes/definitions/auth'
import { getAuthToken } from '@/utils/auth'
import { createUser } from '@/services/user'
import { AuthResponse } from '@/definitions/response'

export async function loginHandler(req: LoginRequest, res: Response) {
    const room = await getRoom(req.body.roomId)

    if (!room) {
        return res.sendStatus(404)
    }

    if (room.pin) {
        if (req.body.pin) {
            if (![req.body.pin, getStoragePin(req.body.pin)].includes(room.pin)) {
                return res.sendStatus(400)
            }
        } else {
            return res.sendStatus(403)
        }
    }

    const user = await createUser(req.body.name, req.body.role)
    await joinRoom(room, user.id)

    const authToken = getAuthToken({
        user: user.id,
        room: room.id,
        pin: room.pin,
    })

    res
        .cookie('authToken', authToken)
        .sendStatus(200)
}

export async function logoutHandler(req: LogoutRequest, res: AuthResponse) {
    const room = res.locals.room
    await leaveRoom(room, res.locals.authTokenPayload.user)

    res
        .clearCookie('authToken')
        .sendStatus(200)
}
