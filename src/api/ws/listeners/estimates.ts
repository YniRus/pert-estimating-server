import { Server, Socket } from '@ws/definitions/socket-io'
import estimatesHandler from '@ws/handlers/estimates'

export default function (io: Server, socket: Socket) {
    const handler = estimatesHandler(io, socket)

    socket.on('mutation:estimate', handler.setEstimate)
}
