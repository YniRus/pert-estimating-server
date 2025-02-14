import { Server, Socket, SocketCallbackFunction } from '@/definitions/socket-io'
import { getUser, getUserEstimatesIds } from '@/services/user'
import { Room } from '@/definitions/room'
import { UID } from '@/definitions/aliases'
import { RequestError } from '@/utils/response/response'
import { getRoomWithActiveUsers, setEstimatesVisible } from '@/services/room'
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

            const roomSockets = await getActiveRoomSockets()
            const connectedUserIds = roomSockets.map((roomSocket) => roomSocket.data.authTokenPayload.user)

            const room = await getRoomWithActiveUsers(
                socket.data.room,
                connectedUserIds,
                socket.data.authTokenPayload.user,
            )

            callback(room)
        },

        async setRoomEstimatesVisible(estimatesVisible: boolean, callback: SocketCallbackFunction<Room>) {
            await setEstimatesVisible(socket.data.room, estimatesVisible)

            const roomSockets = await getActiveRoomSockets()
            const connectedUserIds = roomSockets.map((roomSocket) => roomSocket.data.authTokenPayload.user)

            socket.data.room.estimatesVisible = estimatesVisible
            // TODO: Не брать состояние room из socket (или постоянно его обновлять)
            callback(await getRoomWithActiveUsers(
                socket.data.room,
                connectedUserIds,
                socket.data.authTokenPayload.user,
            ))

            for (const roomSocket of roomSockets) {
                if (roomSocket.data.authTokenPayload.user === socket.data.authTokenPayload.user) continue

                roomSocket.data.room.estimatesVisible = estimatesVisible
                const room = await getRoomWithActiveUsers(
                    roomSocket.data.room,
                    connectedUserIds,
                    roomSocket.data.authTokenPayload.user,
                )

                roomSocket.emit('on:room', room)
            }
        },

        async deleteRoomEstimates(callback: SocketCallbackFunction<Room>) {
            // TODO: Сделать опциональным
            await setEstimatesVisible(socket.data.room, false)
            const estimatesIds = await getUserEstimatesIds(socket.data.room.users)

            for (const estimatesId of estimatesIds) {
                await resetEstimates(estimatesId)
            }

            const roomSockets = await getActiveRoomSockets()
            const connectedUserIds = roomSockets.map((roomSocket) => roomSocket.data.authTokenPayload.user)

            // TODO: Убрать дублирующийся код
            socket.data.room.estimatesVisible = false
            // TODO: Можно не запрашивать внутри estimates, а проставлять дефолтное состояние
            callback(await getRoomWithActiveUsers(
                socket.data.room,
                connectedUserIds,
                socket.data.authTokenPayload.user,
            ))

            for (const roomSocket of roomSockets) {
                if (roomSocket.data.authTokenPayload.user === socket.data.authTokenPayload.user) continue

                socket.data.room.estimatesVisible = false
                const room = await getRoomWithActiveUsers(
                    roomSocket.data.room,
                    connectedUserIds,
                    roomSocket.data.authTokenPayload.user,
                )

                roomSocket.emit('on:room', room)
            }
        },

        async beforeDisconnect() {
            socket.to(socket.data.room.id).emit('on:user-disconnected', socket.data.authTokenPayload.user)
        },
    }
}
