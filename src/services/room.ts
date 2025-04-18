import { Room, RoomConfig, RoomPublic, RoomRaw } from '@/definitions/room'
import { randomUUID } from 'node:crypto'
import { getStoragePin } from '@/utils/room'
import storage from '@/lib/storage'
import { UID } from '@/definitions/aliases'
import { getUser, UserEstimatesReturnType } from '@/services/user'
import { truthy } from '@/utils/utils'

export async function getRoomRaw(id: UID) {
    return await storage.getItem<RoomRaw>(`rooms:${id}`)
}

export async function getRoomPublic(id: UID): Promise<RoomPublic | null> {
    const room = await getRoomRaw(id)
    if (!room) return null

    return getRoomPublicByRaw(room)
}

function getRoomPublicByRaw(room: RoomRaw): RoomPublic {
    return {
        id: room.id,
        users: room.users,
        estimatesVisible: room.estimatesVisible,
        config: room.config,
    }
}

export interface GetRoomWithActiveUsersOptions {
    withEmptyEstimates?: boolean
    withConfig?: boolean
}

export async function getRoomWithActiveUsers(
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
        .map((userId) => getUser(userId, estimatesReturnType(userId))),
    )).filter(truthy)

    const roomPublic = getRoomPublicByRaw(room)
    if (!withConfig) delete roomPublic.config

    return { ...roomPublic, users }
}

export async function createRoom(pin?: string, config?: RoomConfig) {
    const room: RoomRaw = {
        id: randomUUID(),
        users: [],
        createdAt: Date.now(),
        config, // TODO: validate config
    }

    if (pin) {
        room.pin = getStoragePin(pin, room.createdAt)
    }

    return await setRoomRaw(room)
}

export async function setEstimatesVisible(room: RoomRaw, estimatesVisible: boolean) {
    room.estimatesVisible = estimatesVisible
    return await setRoomRaw(room)
}

export async function joinRoom(room: RoomRaw, userId: UID) {
    room.users.push(userId)
    return await setRoomRaw(room)
}

export async function leaveRoom(room: RoomRaw, userId: UID) {
    room.users = room.users.filter((user) => user !== userId)
    return await setRoomRaw(room)
}

async function setRoomRaw(room: RoomRaw) {
    await storage.setItem(`rooms:${room.id}`, room)
    return room
}
