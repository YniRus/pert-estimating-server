import { Server, Socket } from '@/definitions/socket-io'

export default function (io: Server, socket: Socket) {
    return {
        async disconnect(silent?: boolean) {
            if (silent) {
                socket.leave(socket.data.room.id)
            }

            socket.disconnect(true)
        },
    }
}
