import { UID } from '@/definitions/aliases'
import { User } from '@/definitions/user'

export interface Room {
    id: UID
    pin?: string
    users: UID[]
}

export interface RoomPopulated {
    id: UID
    users: User[]
}
