import useRoomService from '@/services/room'
import {
    getRequestAuthToken,
    getRequestAuthTokenPayload,
    isAuthTokenPayloadAccessAllowed,
    isValidAuthTokenPayload,
} from '@/utils/auth'
import { SocketMiddlewareNextFunction } from '@ws/definitions/socket-io'
import { Socket } from 'socket.io'
import { RequestError } from '@/utils/response'
import { getServiceContext } from '@/utils/context'

declare module 'socket.io/dist/socket' {
    export interface Handshake {
        authToken: string
    }
}

export default async function (socket: Socket, next: SocketMiddlewareNextFunction) {
    const authToken = getRequestAuthToken(socket.handshake)
    if (!authToken) return next(new RequestError(401))

    const authTokenPayload = getRequestAuthTokenPayload(authToken)
    if (!isValidAuthTokenPayload(authTokenPayload)) return next(new RequestError(400))

    const room = await useRoomService(getServiceContext(socket)).getRoomRaw(authTokenPayload.room)
    if (!room) return next(new RequestError(404))

    if (!isAuthTokenPayloadAccessAllowed(authTokenPayload, room)) return next(new RequestError(403))

    socket.handshake.authToken = authToken
    socket.data = { ...socket.data, authTokenPayload, room }

    socket.join(room.id)

    return next()
}
