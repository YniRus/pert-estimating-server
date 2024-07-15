import { createHash } from "node:crypto";

export function getStoragePin(userPin: string) {
    return createHash('sha1')
        .update(userPin)
        .update(process.env.ROOM_PIN_SALT || "")
        .digest('hex')
}