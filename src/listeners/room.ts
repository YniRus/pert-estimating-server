import { Server, Socket } from '@/definitions/socket-io'
import roomHandler from '@/handlers/room'

export default function (io: Server, socket: Socket) {
    const handler = roomHandler(io, socket)

    handler.onConnect()

    socket.on('query:room', handler.getRoomInfo)

    socket.on('disconnecting', handler.beforeDisconnect)
}
