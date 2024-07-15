import {UID} from "@/definitions/aliases";

export interface Room {
    uid: UID
    pin?: string
    users: UID[]
}