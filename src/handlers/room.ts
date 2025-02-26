import { RemoveSocket, Server, Socket, SocketCallbackFunction } from '@/definitions/socket-io'
import { getUser, getUserEstimatesIds, UserEstimatesReturnType } from '@/services/user'
import { Room, RoomRaw } from '@/definitions/room'
import { UID } from '@/definitions/aliases'
import { RequestError } from '@/utils/response/response'
import { getRoomRaw, getRoomWithActiveUsers, setEstimatesVisible } from '@/services/room'
import { resetEstimates } from '@/services/estimate'

type CallbackRoomInfoOptions = {
    withBroadcast?: boolean
    withEmptyEstimates?: boolean
}

export default function (io: Server, socket: Socket) {
    async function getActiveRoomSockets() {
        return io.in(socket.data.room.id).fetchSockets()
    }

    function getSocketsUserIds(sockets: RemoveSocket[]) {
        return sockets.map((socket) => socket.data.authTokenPayload.user)
    }

    async function callbackRoomInfo(
        room: RoomRaw,
        callback: SocketCallbackFunction<Room>,
        options?: CallbackRoomInfoOptions,
    ) {
        const { withBroadcast = false, withEmptyEstimates = false } = options || {}

        const roomSockets = await getActiveRoomSockets()
        const activeUserIds = getSocketsUserIds(roomSockets)

        callback(await getRoomWithActiveUsers(
            room,
            activeUserIds,
            socket.data.authTokenPayload.user,
            withEmptyEstimates,
        ))

        if (!withBroadcast) return

        for (const roomSocket of roomSockets) {
            if (roomSocket.data.authTokenPayload.user === socket.data.authTokenPayload.user) continue

            const roomWithActiveUsers = await getRoomWithActiveUsers(
                room,
                activeUserIds,
                roomSocket.data.authTokenPayload.user,
                withEmptyEstimates,
            )

            roomSocket.emit('on:room', roomWithActiveUsers)
        }
    }

    return {
        async onConnect() {
            const estimatesReturnType = socket.data.room.estimatesVisible
                ? UserEstimatesReturnType.Open
                : UserEstimatesReturnType.Hidden

            const user = await getUser(socket.data.authTokenPayload.user, estimatesReturnType)
            if (user) socket.to(socket.data.room.id).emit('on:user-connected', user)
        },

        async getRoomInfo(roomId: UID, callback: SocketCallbackFunction<Room>) {
            if (socket.data.room.id !== roomId) return callback(new RequestError(403).response)

            const room = await getRoomRaw(roomId)
            if (!room) return callback(new RequestError(404).response)

            await callbackRoomInfo(room, callback)
        },

        async setRoomEstimatesVisible(estimatesVisible: boolean, callback: SocketCallbackFunction<Room>) {
            const room = await getRoomRaw(socket.data.room.id)
            if (!room) return callback(new RequestError(404).response)

            await setEstimatesVisible(room, estimatesVisible)

            await callbackRoomInfo(room, callback, {
                withBroadcast: true,
            })
        },

        async deleteRoomEstimates(callback: SocketCallbackFunction<Room>) {
            let room = await getRoomRaw(socket.data.room.id)
            if (!room) return callback(new RequestError(404).response)

            // TODO: New Feature = Дать возможность опционально проставлять Visible при очистке оценок
            room = await setEstimatesVisible(room, false)

            const estimatesIds = await getUserEstimatesIds(room.users)
            for (const estimatesId of estimatesIds) {
                await resetEstimates(estimatesId)
            }

            await callbackRoomInfo(room, callback, {
                withBroadcast: true,
                withEmptyEstimates: true,
            })
        },

        async beforeDisconnect() {
            if (socket.rooms.has(socket.data.room.id)) {
                socket.to(socket.data.room.id).emit('on:user-disconnected', socket.data.authTokenPayload.user)
            }
        },
    }
}
