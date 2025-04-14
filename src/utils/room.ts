import { createHash } from 'node:crypto'
import { RoomRaw } from '@/definitions/room'
import { Timestamp } from '@/definitions/aliases'

export function getStoragePin(userPin: string, timestamp: Timestamp) {
    return createHash('sha1')
        .update(userPin)
        .update(`${timestamp}`)
        .update(process.env.ROOM_PIN_SALT || '')
        .digest('hex')
}

export function getRoomAccessUrl(room: RoomRaw, host?: string) {
    return `${host || ''}/join/${room.id}${room.pin ? `?pin=${room.pin}` : ''}`
}
