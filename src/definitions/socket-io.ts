import { UID } from '@/definitions/aliases'
import { Room, RoomPopulated } from '@/definitions/room'
import { AuthTokenPayload } from '@/definitions/auth'
import type { Server as _Server, Socket as _Socket } from 'socket.io'
import { ErrorResponse } from '@/utils/response/response'

export type SocketMiddlewareNextFunction = (err?: Error) => void
export type SocketCallbackFunction<T> = (response: T | ErrorResponse) => void

const enum SocketEvent {
    Room = 'room',
}

const enum SocketEventType {
    Query = 'query',
    Mutation = 'mutation',
}

type _Event<Event extends SocketEvent, Type extends SocketEventType> = `${Event}:${Type}`
type Query<Event extends SocketEvent> = _Event<Event, SocketEventType.Query>
type Mutation<Event extends SocketEvent> = _Event<Event, SocketEventType.Mutation>

interface ServerToClientEvents {

}

export type ClientToServerEvents = {
    [key in Query<SocketEvent.Room>]: (room: UID, callback: SocketCallbackFunction<RoomPopulated>) => void
}

interface SocketData {
    authTokenPayload: AuthTokenPayload
    room: Room
}

export type Socket = _Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    never,
    SocketData
>

export type Server = _Server<
    ClientToServerEvents,
    ServerToClientEvents,
    never,
    SocketData
>
