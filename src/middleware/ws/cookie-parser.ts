import type { Request } from 'express'
import cookie from 'cookie'
import { Socket } from 'socket.io'
import { SocketMiddlewareNextFunction } from '@/definitions/socket-io'
import { RequestError } from '@/utils/response/response'

declare module 'socket.io/dist/socket' {
    export interface Handshake {
        cookies: Request['cookies']
    }
}

export default function (socket: Socket, next: SocketMiddlewareNextFunction) {
    const cookieHeader = socket.request.headers.cookie
    if (!cookieHeader) return next(new RequestError(400, 'Cookie header not found'))

    socket.handshake.cookies = cookie.parse(cookieHeader)
    return next()
}
