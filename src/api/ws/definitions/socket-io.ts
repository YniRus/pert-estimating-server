import { UID } from '@/definitions/aliases'
import { Room, RoomRaw, RoomWithoutConfig } from '@/definitions/room'
import { AuthTokenPayload } from '@/definitions/auth'
import type { Server as _Server, Socket as _Socket, RemoteSocket as _RemoteSocket } from 'socket.io'
import { ErrorResponse } from '@/utils/response'
import { UserPublic } from '@/definitions/user'
import { Estimate, Estimates, EstimateType } from '@/definitions/estimates'
import { RoomInfoContext } from '@ws/handlers/room'
import { AppData } from '@/definitions/app'
import { type Storage } from '@/lib/storage'

export type SocketMiddlewareNextFunction = (err?: Error) => void
export type SocketCallbackFunction<T> = (response: T | ErrorResponse) => void

interface ServerToClientEvents {
    'on:user-connected': (user: UserPublic) => void
    'on:user-disconnected': (userId: UID) => void
    'on:estimates': (userId: UID, estimates: Estimates) => void
    'on:room': (room: RoomWithoutConfig, context?: RoomInfoContext) => void
}

interface ClientToServerEvents {
    'query:room': (room: UID, callback: SocketCallbackFunction<Room>) => void
    'mutation:estimate': (type: EstimateType, estimate: Estimate, callback: SocketCallbackFunction<true>) => void
    'mutation:room-estimates-visible': (estimatesVisible: boolean, callback: SocketCallbackFunction<RoomWithoutConfig>) => void
    'mutation:room-delete-estimates': (callback: SocketCallbackFunction<RoomWithoutConfig>) => void
    'mutation:disconnect': (silent?: boolean) => void
}

interface ServerSideEvents {}

interface SocketData {
    authTokenPayload: AuthTokenPayload
    /* Данные, актуальные только на момент подключение */ room: RoomRaw
    app: AppData
    storage: Storage
    silent?: boolean
}

export type Socket = _Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    ServerSideEvents,
    SocketData
>

export type RemoveSocket = _RemoteSocket<ServerToClientEvents, SocketData>

export type Server = _Server<
    ClientToServerEvents,
    ServerToClientEvents,
    ServerSideEvents,
    SocketData
>
