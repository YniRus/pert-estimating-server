import {createHash} from "node:crypto";
import {UID} from "@/definitions/aliases";
import {Room} from "@/definitions/room";

export function getRoomUserAuthToken(room: Room, user: UID) {
    return createHash('sha1')
        .update(room.uid)
        .update(room.pin || "")
        .update(user)
        .update(process.env.AUTH_COOKIE_SALT || "")
        .digest('hex')
}