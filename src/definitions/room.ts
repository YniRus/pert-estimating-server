import { UID } from '@/definitions/aliases'
import { User } from '@/definitions/user'

export interface Room {
    uid: UID
    pin?: string
    users: UID[]
}

export interface RoomPopulated {
    uid: UID
    users: User[]
}
