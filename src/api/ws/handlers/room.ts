import { RemoveSocket, Server, Socket, SocketCallbackFunction } from '@ws/definitions/socket-io'
import useUserService, { UserEstimatesReturnType } from '@/services/user'
import { Room, RoomRaw } from '@/definitions/room'
import { UID } from '@/definitions/aliases'
import { RequestError } from '@/utils/response'
import useRoomService from '@/services/room'
import useEstimateService from '@/services/estimate'
import { getServiceContext } from '@/utils/context'

type CallbackRoomInfoOptions = {
    withBroadcast?: boolean
    broadcastContext?: RoomInfoContext
    withEmptyEstimates?: boolean
    withConfig?: boolean
}

export enum RoomInfoContext {
    UpdateEstimatesVisible = 'update-estimates-visible',
    DeleteEstimates = 'delete-estimates',
}

export default function (io: Server, socket: Socket) {
    const context = getServiceContext(socket)
    const roomService = useRoomService(context)
    const userService = useUserService(context)
    const estimateService = useEstimateService(context)

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
        const { withBroadcast = false, withEmptyEstimates = false, withConfig = false } = options || {}

        const roomSockets = await getActiveRoomSockets()
        const activeUserIds = getSocketsUserIds(roomSockets)

        callback(await roomService.getRoomWithActiveUsers(
            room,
            activeUserIds,
            socket.data.authTokenPayload.user,
            { withEmptyEstimates, withConfig: withConfig && !withBroadcast },
        ))

        if (!withBroadcast) return

        for (const roomSocket of roomSockets) {
            if (roomSocket.data.authTokenPayload.user === socket.data.authTokenPayload.user) continue

            const roomWithActiveUsers = await roomService.getRoomWithActiveUsers(
                room,
                activeUserIds,
                roomSocket.data.authTokenPayload.user,
                { withEmptyEstimates },
            )

            roomSocket.emit('on:room', roomWithActiveUsers, options?.broadcastContext)
        }
    }

    return {
        async onConnect() {
            const estimatesReturnType = socket.data.room.estimatesVisible
                ? UserEstimatesReturnType.Open
                : UserEstimatesReturnType.Hidden

            const user = await userService.getUser(socket.data.authTokenPayload.user, estimatesReturnType)
            if (user) socket.to(socket.data.room.id).emit('on:user-connected', user)
        },

        async getRoomInfo(roomId: UID, callback: SocketCallbackFunction<Room>) {
            if (socket.data.room.id !== roomId) return callback(new RequestError(403).response)

            const room = await roomService.getRoomRaw(roomId)
            if (!room) return callback(new RequestError(404).response)

            await callbackRoomInfo(room, callback, {
                withConfig: true,
            })
        },

        async setRoomEstimatesVisible(estimatesVisible: boolean, callback: SocketCallbackFunction<Room>) {
            const room = await roomService.getRoomRaw(socket.data.room.id)
            if (!room) return callback(new RequestError(404).response)

            await roomService.setEstimatesVisible(room, estimatesVisible)

            await callbackRoomInfo(room, callback, {
                withBroadcast: true,
                broadcastContext: RoomInfoContext.UpdateEstimatesVisible,
            })
        },

        async deleteRoomEstimates(callback: SocketCallbackFunction<Room>) {
            let room = await roomService.getRoomRaw(socket.data.room.id)
            if (!room) return callback(new RequestError(404).response)

            // TODO: New Feature = Дать возможность опционально проставлять Visible при очистке оценок
            room = await roomService.setEstimatesVisible(room, false)

            const estimatesIds = await userService.getUserEstimatesIds(room.users)
            for (const estimatesId of estimatesIds) {
                await estimateService.resetEstimates(estimatesId)
            }

            await callbackRoomInfo(room, callback, {
                withBroadcast: true,
                broadcastContext: RoomInfoContext.DeleteEstimates,
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
