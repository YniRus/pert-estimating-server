import { Server, Socket, SocketCallbackFunction } from '@/definitions/socket-io'
import { AuthWSResponse } from '@/handlers/definitions/auth'
import { getUserPublic } from '@/services/user'
import { RequestError } from '@/utils/response/response'

export default function (io: Server, socket: Socket) {
    return {
        async getAuth(callback: SocketCallbackFunction<AuthWSResponse>) {
            const user = await getUserPublic(socket.data.authTokenPayload.user)
            if (!user) return callback(new RequestError(403).response)

            callback({
                roomId: socket.data.room.id,
                user,
            })
        },
    }
}
