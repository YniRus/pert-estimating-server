import { createHash } from "node:crypto";
import {Room} from "@/definitions/room";

export function getStoragePin(userPin: string) {
    return createHash('sha1')
        .update(userPin)
        .update(process.env.ROOM_PIN_SALT || "")
        .digest('hex')
}

export function getRoomAccessUrl(room: Room) {
    return `${process.env.CLIENT_HOST}/join/${room.uid}${room.pin ? `?pin=${room.pin}` : ''}`
}