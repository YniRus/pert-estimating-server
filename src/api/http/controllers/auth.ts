import { Request } from 'express'
import { joinRoom, leaveRoom } from '@/services/room'
import { LoginRequest, LogoutRequest } from '@http/routes/definitions/auth'
import { getAuthToken } from '@/utils/auth'
import { createUser, getUserPublic } from '@/services/user'
import { AuthResponse, RoomResponse } from '@http/definitions/response'
import response from '@http/utils/response'

export async function loginHandler(req: LoginRequest, res: RoomResponse) {
    const room = res.locals.room

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

    response(res).success({
        roomId: res.locals.room.id,
        user,
    })
}

export async function logoutHandler(req: LogoutRequest, res: AuthResponse) {
    await leaveRoom(res.locals.room, res.locals.authTokenPayload.user)

    res
        .clearCookie('authToken')
        .sendStatus(200)
}
