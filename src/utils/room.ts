import { createHash } from 'node:crypto'
import { RoomRaw } from '@/definitions/room'

export function getStoragePin(userPin: string) {
    return createHash('sha1')
        .update(userPin)
        .update(process.env.ROOM_PIN_SALT || '')
        .digest('hex')
}

export function getRoomAccessUrl(room: RoomRaw) {
    return `${process.env.CLIENT_HOST}/join/${room.id}${room.pin ? `?pin=${room.pin}` : ''}`
}
