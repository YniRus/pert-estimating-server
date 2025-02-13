import { Server, Socket, SocketCallbackFunction } from '@/definitions/socket-io'
import { getUser } from '@/services/user'
import { Room, RoomRaw } from '@/definitions/room'
import { UID } from '@/definitions/aliases'
import { RequestError } from '@/utils/response/response'
import { User } from '@/definitions/user'

export default function (io: Server, socket: Socket) {
    return {
        async onConnect() {
            const user = await getUser(socket.data.authTokenPayload.user)
            if (user) socket.to(socket.data.room.id).emit('on:user-connected', user)
        },

        async getRoomInfo(roomId: UID, callback: SocketCallbackFunction<Room>) {
            const room: RoomRaw = socket.data.room
            if (room.id !== roomId) return callback(new RequestError(403).response)

            const connectedUserIds = (await io.in(room.id).fetchSockets()).map((roomSocket) => {
                return roomSocket.data.authTokenPayload.user
            })

            const users = (await Promise.all(room.users.map((user) => {
                return getUser(user, user === socket.data.authTokenPayload.user)
            }))).filter((user): user is User => !!user && connectedUserIds.includes(user.id))

            callback({
                id: room.id,
                users,
            })
        },

        async beforeDisconnect() {
            socket.to(socket.data.room.id).emit('on:user-disconnected', socket.data.authTokenPayload.user)
        },
    }
}
