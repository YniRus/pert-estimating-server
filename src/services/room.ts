import { Room } from '@/definitions/room'
import { randomUUID } from 'node:crypto'
import { getStoragePin } from '@/utils/room'
import storage from '@/lib/storage'
import { UID } from '@/definitions/aliases'

export async function getRoom(uid: UID) {
    return await storage.getItem<Room>(`rooms:${uid}`)
}

export async function createRoom(pin?: string) {
    const room: Room = {
        uid: randomUUID(),
        users: [],
    }

    if (pin) {
        room.pin = getStoragePin(pin)
    }

    await storage.setItem(`rooms:${room.uid}`, room)

    return room
}

export async function joinRoom(room: Room, userId: UID) {
    room.users.push(userId)
    await storage.setItem(`rooms:${room.uid}`, room)
}
