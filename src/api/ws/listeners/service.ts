import { Server, Socket } from '@ws/definitions/socket-io'
import serviceHandler from '@ws/handlers/service'

export default function (io: Server, socket: Socket) {
    const handler = serviceHandler(io, socket)

    socket.on('mutation:disconnect', handler.disconnect)
}
