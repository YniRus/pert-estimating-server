import { Server, Socket, SocketCallbackFunction } from '@/definitions/socket-io'
import { getUser, getUserEstimatesIds } from '@/services/user'
import { Room } from '@/definitions/room'
import { UID } from '@/definitions/aliases'
import { RequestError } from '@/utils/response/response'
import { getRoomRaw, getRoomWithActiveUsers, setEstimatesVisible } from '@/services/room'
import { resetEstimates } from '@/services/estimate'

export default function (io: Server, socket: Socket) {
    async function getActiveRoomSockets() {
        return io.in(socket.data.room.id).fetchSockets()
    }

    return {
        async onConnect() {
            const user = await getUser(socket.data.authTokenPayload.user, socket.data.room.estimatesVisible)
            if (user) socket.to(socket.data.room.id).emit('on:user-connected', user)
        },

        async getRoomInfo(roomId: UID, callback: SocketCallbackFunction<Room>) {
            if (socket.data.room.id !== roomId) return callback(new RequestError(403).response)

            const room = await getRoomRaw(roomId)
            if (!room) return callback(new RequestError(404).response)

            const roomSockets = await getActiveRoomSockets()
            const connectedUserIds = roomSockets.map((roomSocket) => roomSocket.data.authTokenPayload.user)

            const roomWithActiveUsers = await getRoomWithActiveUsers(
                room,
                connectedUserIds,
                socket.data.authTokenPayload.user,
            )

            callback(roomWithActiveUsers)
        },

        async setRoomEstimatesVisible(estimatesVisible: boolean, callback: SocketCallbackFunction<Room>) {
            const room = await getRoomRaw(socket.data.room.id)
            if (!room) return callback(new RequestError(404).response)

            await setEstimatesVisible(room, estimatesVisible)

            const roomSockets = await getActiveRoomSockets()
            const connectedUserIds = roomSockets.map((roomSocket) => roomSocket.data.authTokenPayload.user)

            callback(await getRoomWithActiveUsers(
                room,
                connectedUserIds,
                socket.data.authTokenPayload.user,
            ))

            for (const roomSocket of roomSockets) {
                if (roomSocket.data.authTokenPayload.user === socket.data.authTokenPayload.user) continue

                const roomWithActiveUsers = await getRoomWithActiveUsers(
                    room,
                    connectedUserIds,
                    roomSocket.data.authTokenPayload.user,
                )

                roomSocket.emit('on:room', roomWithActiveUsers)
            }
        },

        async deleteRoomEstimates(callback: SocketCallbackFunction<Room>) {
            let room = await getRoomRaw(socket.data.room.id)
            if (!room) return callback(new RequestError(404).response)

            // TODO: Сделать опциональным
            room = await setEstimatesVisible(room, false)
            const estimatesIds = await getUserEstimatesIds(room.users)

            for (const estimatesId of estimatesIds) {
                await resetEstimates(estimatesId)
            }

            const roomSockets = await getActiveRoomSockets()
            const connectedUserIds = roomSockets.map((roomSocket) => roomSocket.data.authTokenPayload.user)

            // TODO: Убрать дублирующийся код
            // TODO: Можно не запрашивать внутри estimates, а проставлять дефолтное состояние
            callback(await getRoomWithActiveUsers(
                room,
                connectedUserIds,
                socket.data.authTokenPayload.user,
            ))

            for (const roomSocket of roomSockets) {
                if (roomSocket.data.authTokenPayload.user === socket.data.authTokenPayload.user) continue

                const roomWithActiveUsers = await getRoomWithActiveUsers(
                    room,
                    connectedUserIds,
                    roomSocket.data.authTokenPayload.user,
                )

                roomSocket.emit('on:room', roomWithActiveUsers)
            }
        },

        async beforeDisconnect() {
            socket.to(socket.data.room.id).emit('on:user-disconnected', socket.data.authTokenPayload.user)
        },
    }
}
