import { Server, Socket } from '@/definitions/socket-io'
import roomHandler from '@/handlers/room'

export default function (io: Server, socket: Socket) {
    const handler = roomHandler(io, socket)

    socket.on('query:room', handler.getRoomInfo)
}
