import { RoomPublic, RoomRaw } from '@/definitions/room'
import { randomUUID } from 'node:crypto'
import { getStoragePin } from '@/utils/room'
import storage from '@/lib/storage'
import { UID } from '@/definitions/aliases'

export async function getRoomRaw(id: UID) {
    return await storage.getItem<RoomRaw>(`rooms:${id}`)
}

export async function getRoomPublic(id: UID): Promise<RoomPublic | null> {
    const room = await getRoomRaw(id)

    if (room) {
        delete room.pin
    }

    return room
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

export async function joinRoom(room: RoomRaw, userId: UID) {
    room.users.push(userId)
    await storage.setItem(`rooms:${room.id}`, room)
}

export async function leaveRoom(room: RoomRaw, userId: UID) {
    room.users = room.users.filter((user) => user !== userId)
    await storage.setItem(`rooms:${room.id}`, room)
}
