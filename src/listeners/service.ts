import { Server, Socket } from '@/definitions/socket-io'
import serviceHandler from '@/handlers/service'

export default function (io: Server, socket: Socket) {
    const handler = serviceHandler(io, socket)

    socket.on('mutation:disconnect', handler.disconnect)
}
