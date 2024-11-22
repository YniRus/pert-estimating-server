import { Server, Socket, SocketCallbackFunction } from '@/definitions/socket-io'
import { getUser } from '@/services/user'
import { Room, RoomPopulated } from '@/definitions/room'
import { UID } from '@/definitions/aliases'
import { RequestError } from '@/utils/response/response'
import { User } from '@/definitions/user'

export default function (io: Server, socket: Socket) {
    return {
        async getRoomInfo(roomUid: UID, callback: SocketCallbackFunction<RoomPopulated>) {
            const room: Room = socket.data.room
            if (room.uid !== roomUid) callback(new RequestError(403).response)

            const connectedUserIds = (await io.in(room.uid).fetchSockets()).map((roomSocket) => {
                return roomSocket.data.authTokenPayload.user
            })

            const users = (await Promise.all(
                room.users.map(async (user) => await getUser(user)),
            )).filter((user): user is User => !!user && connectedUserIds.includes(user.uid))

            const roomPublicData = {
                uid: room.uid,
                users,
            }

            callback(roomPublicData)
        },
    }
}
