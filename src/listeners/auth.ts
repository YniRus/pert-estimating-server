import { Server, Socket } from '@/definitions/socket-io'
import authHandler from '@/handlers/auth'

export default function (io: Server, socket: Socket) {
    const handler = authHandler(io, socket)

    socket.on('query:auth', handler.getAuth)
}
