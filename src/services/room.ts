import { Room, RoomConfig, RoomPublic, RoomRaw } from '@/definitions/room'
import { randomUUID } from 'node:crypto'
import { getStoragePin } from '@/utils/room'
import { UID } from '@/definitions/aliases'
import useUserService, { UserEstimatesReturnType } from '@/services/user'
import { truthy } from '@/utils/utils'
import { ServiceContext } from '@/definitions/context'

export interface GetRoomWithActiveUsersOptions {
    withEmptyEstimates?: boolean
    withConfig?: boolean
}

function getRoomPublicByRaw(room: RoomRaw): RoomPublic {
    return {
        id: room.id,
        users: room.users,
        estimatesVisible: room.estimatesVisible,
        config: room.config,
    }
}

export default ({ storage }: ServiceContext) => ({
    async getRoomRaw(id: UID) {
        return await storage.getItem<RoomRaw>(`rooms:${id}`)
    },

    async getRoomPublic(id: UID): Promise<RoomPublic | null> {
        const room = await this.getRoomRaw(id)
        if (!room) return null

        return getRoomPublicByRaw(room)
    },

    async getRoomWithActiveUsers(
        room: RoomRaw,
        activeUserIds: UID[],
        authUserId: UID,
        options?: GetRoomWithActiveUsersOptions,
    ): Promise<Room> {
        const { withEmptyEstimates = false, withConfig = false } = options || {}

        const estimatesReturnType = (userId: string) => {
            if (withEmptyEstimates) return UserEstimatesReturnType.Empty
            if (room.estimatesVisible || userId === authUserId) return UserEstimatesReturnType.Open
            return UserEstimatesReturnType.Hidden
        }

        const users = (await Promise.all(room.users
            .filter((userId) => activeUserIds.includes(userId))
            .map((userId) => useUserService({ storage }).getUser(userId, estimatesReturnType(userId))),
        )).filter(truthy)

        const roomPublic = getRoomPublicByRaw(room)
        if (!withConfig) delete roomPublic.config

        return { ...roomPublic, users }
    },

    async createRoom(pin?: string, config?: RoomConfig) {
        const room: RoomRaw = {
            id: randomUUID(),
            users: [],
            createdAt: Date.now(),
            config, // TODO: validate config
        }

        if (pin) {
            room.pin = getStoragePin(pin, room.createdAt)
        }

        return await this.setRoomRaw(room)
    },

    async setEstimatesVisible(room: RoomRaw, estimatesVisible: boolean) {
        room.estimatesVisible = estimatesVisible
        return await this.setRoomRaw(room)
    },

    async joinRoom(room: RoomRaw, userId: UID) {
        room.users.push(userId)
        return await this.setRoomRaw(room)
    },

    async leaveRoom(room: RoomRaw, userId: UID) {
        room.users = room.users.filter((user) => user !== userId)
        return await this.setRoomRaw(room)
    },

    async setRoomRaw(room: RoomRaw) {
        await storage.setItem(`rooms:${room.id}`, room)
        return room
    },
})
