import { Request, Response } from 'express'
import { getStoragePin } from '@/utils/room'
import { getRoomRaw, joinRoom, leaveRoom } from '@/services/room'
import { LoginRequest, LogoutRequest } from '@/routes/definitions/auth'
import { getAuthToken } from '@/utils/auth'
import { createUser, getUserPublic } from '@/services/user'
import { AuthResponse } from '@/definitions/response'
import http from '@/utils/response/http'

export async function loginHandler(req: LoginRequest, res: Response) {
    const room = await getRoomRaw(req.body.roomId)

    if (!room) {
        return res.sendStatus(404)
    }

    if (room.pin) {
        if (req.body.pin) {
            if (![req.body.pin, getStoragePin(req.body.pin, room.createdAt)].includes(room.pin)) {
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
        estimates: user.estimates,
        pin: room.pin,
    })

    res
        .cookie('authToken', authToken, { sameSite: 'none', secure: true })
        .sendStatus(200)
}

export async function authHandler(req: Request, res: AuthResponse) {
    const user = await getUserPublic(res.locals.authTokenPayload.user)
    if (!user) return res.sendStatus(404)

    http(res).success({
        roomId: res.locals.room.id,
        user,
    })
}

export async function logoutHandler(req: LogoutRequest, res: AuthResponse) {
    const room = await getRoomRaw(res.locals.room.id)
    room && await leaveRoom(room, res.locals.authTokenPayload.user)

    res
        .clearCookie('authToken')
        .sendStatus(200)
}
