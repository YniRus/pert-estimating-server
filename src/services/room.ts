import { Room, RoomPublic, RoomRaw } from '@/definitions/room'
import { randomUUID } from 'node:crypto'
import { getStoragePin } from '@/utils/room'
import storage from '@/lib/storage'
import { UID } from '@/definitions/aliases'
import { getUser } from '@/services/user'
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
    delete room.pin
    return room
}

export async function getRoomWithActiveUsers(room: RoomRaw, activeUserIds: UID[], authUserId: UID): Promise<Room> {
    const withOpenEstimates = (userId: string) => {
        return room.estimatesVisible ? true : userId === authUserId
    }

    const users = (await Promise.all(room.users
        .filter((userId) => activeUserIds.includes(userId))
        .map((userId) => getUser(userId, withOpenEstimates(userId))),
    )).filter(truthy)

    return { ...getRoomPublicByRaw(room), users }
}

export async function createRoom(pin?: string) {
    const room: RoomRaw = {
        id: randomUUID(),
        users: [],
    }

    if (pin) {
        room.pin = getStoragePin(pin)
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
