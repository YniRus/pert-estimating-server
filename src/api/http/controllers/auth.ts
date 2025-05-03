import { Request } from 'express'
import useRoomService from '@/services/room'
import { LoginRequest, LogoutRequest } from '@http/routes/definitions/auth'
import { getAuthToken } from '@/utils/auth'
import useUserService from '@/services/user'
import { AuthResponse, RoomResponse } from '@http/definitions/response'
import response from '@http/utils/response'
import { getServiceContext } from '@/utils/context'

export async function loginHandler(req: LoginRequest, res: RoomResponse) {
    const room = res.locals.room

    const context = getServiceContext(res)
    const user = await useUserService(context).createUser(req.body.name, req.body.role)
    await useRoomService(context).joinRoom(room, user.id)

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
    const context = getServiceContext(res)
    const user = await useUserService(context).getUserPublic(res.locals.authTokenPayload.user)
    if (!user) return res.sendStatus(404)

    response(res).success({
        roomId: res.locals.room.id,
        user,
    })
}

export async function logoutHandler(req: LogoutRequest, res: AuthResponse) {
    const context = getServiceContext(res)
    await useRoomService(context).leaveRoom(res.locals.room, res.locals.authTokenPayload.user)

    res
        .clearCookie('authToken')
        .sendStatus(200)
}
