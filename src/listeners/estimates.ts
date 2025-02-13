import { Server, Socket } from '@/definitions/socket-io'
import estimatesHandler from '@/handlers/estimates'

export default function (io: Server, socket: Socket) {
    const handler = estimatesHandler(io, socket)

    socket.on('mutation:estimate', handler.setEstimate)
}
