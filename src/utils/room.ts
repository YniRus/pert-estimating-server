import { createHash } from "node:crypto";
import {Room} from "@/definitions/room";
import {User} from "@/definitions/user";

export function getStoragePin(userPin: string) {
    return createHash('sha1')
        .update(userPin)
        .update(process.env.ROOM_PIN_SALT || "")
        .digest('hex')
}

export function getRoomUserAuthToken(room: Room, user: User) {
    return createHash('sha1')
        .update(room.uid)
        .update(room.pin || "")
        .update(user.uid)
        .update(process.env.AUTH_COOKIE_SALT || "")
        .digest('hex')
}

export function getRoomAccessUrl(room: Room) {
    return `${process.env.CLIENT_HOST}/join/${room.uid}${room.pin ? `?pin=${room.pin}` : ''}`
}