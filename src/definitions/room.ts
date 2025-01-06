import { UID } from '@/definitions/aliases'
import { User } from '@/definitions/user'

export interface Room {
    id: UID
    pin?: string
    users: UID[]
    estimatesVisible?: boolean
}

export interface RoomPublic extends Omit<Room, 'pin'> {}

export interface RoomPopulated extends Omit<RoomPublic, 'users'> {
    users: User[]
}
