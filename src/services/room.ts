import { Room } from '@/definitions/room'
import { randomUUID } from 'node:crypto'
import { getStoragePin } from '@/utils/room'
import storage from '@/lib/storage'
import { UID } from '@/definitions/aliases'

export async function getRoom(id: UID) {
    return await storage.getItem<Room>(`rooms:${id}`)
}

export async function createRoom(pin?: string) {
    const room: Room = {
        id: randomUUID(),
        users: [],
    }

    if (pin) {
        room.pin = getStoragePin(pin)
    }

    await storage.setItem(`rooms:${room.id}`, room)

    return room
}

export async function joinRoom(room: Room, userId: UID) {
    room.users.push(userId)
    await storage.setItem(`rooms:${room.id}`, room)
}

export async function leaveRoom(room: Room, userId: UID) {
    room.users = room.users.filter((user) => user !== userId)
    await storage.setItem(`rooms:${room.id}`, room)
}
