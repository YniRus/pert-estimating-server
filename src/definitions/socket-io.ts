import { UID } from '@/definitions/aliases'
import { Room, RoomPopulated } from '@/definitions/room'
import { AuthTokenPayload } from '@/definitions/auth'
import type { Server as _Server, Socket as _Socket } from 'socket.io'
import { ErrorResponse } from '@/utils/response/response'
import { User } from '@/definitions/user'
import { AuthWSResponse } from '@/handlers/definitions/auth'

export type SocketMiddlewareNextFunction = (err?: Error) => void
export type SocketCallbackFunction<T> = (response: T | ErrorResponse) => void

interface ServerToClientEvents {
    'on:user-connected': (user: User) => void
    'on:user-disconnected': (userId: UID) => void
}

interface ClientToServerEvents {
    'query:room': (room: UID, callback: SocketCallbackFunction<RoomPopulated>) => void
    'query:auth': (callback: SocketCallbackFunction<AuthWSResponse>) => void
}

interface ServerSideEvents {}

interface SocketData {
    authTokenPayload: AuthTokenPayload
    room: Room
}

export type Socket = _Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    ServerSideEvents,
    SocketData
>

export type Server = _Server<
    ClientToServerEvents,
    ServerToClientEvents,
    ServerSideEvents,
    SocketData
>
