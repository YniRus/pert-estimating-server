import { Room, RoomPublic, RoomRaw } from '@/definitions/room'
import { randomUUID } from 'node:crypto'
import { getStoragePin } from '@/utils/room'
import storage from '@/lib/storage'
import { UID } from '@/definitions/aliases'
import { getUser } from '@/services/user'
import { User } from '@/definitions/user'

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

    const users = (await Promise.all(room.users.map((userId) => {
        return getUser(userId, withOpenEstimates(userId))
    }))).filter((user): user is User => !!user && activeUserIds.includes(user.id))

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

    await storage.setItem(`rooms:${room.id}`, room)

    return room
}

export async function setEstimatesVisible(room: RoomRaw, estimatesVisible: boolean) {
    room.estimatesVisible = estimatesVisible
    await storage.setItem(`rooms:${room.id}`, room)
}

export async function joinRoom(room: RoomRaw, userId: UID) {
    room.users.push(userId)
    await storage.setItem(`rooms:${room.id}`, room)
}

export async function leaveRoom(room: RoomRaw, userId: UID) {
    room.users = room.users.filter((user) => user !== userId)
    await storage.setItem(`rooms:${room.id}`, room)
}
