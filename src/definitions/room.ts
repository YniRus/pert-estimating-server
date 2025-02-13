import { UID } from '@/definitions/aliases'
import { User } from '@/definitions/user'

export interface RoomRaw {
    id: UID
    pin?: string
    users: UID[]
    estimatesVisible?: boolean
}

export interface RoomPublic extends Omit<RoomRaw, 'pin'> {}

export interface Room extends Omit<RoomPublic, 'users'> {
    users: User[]
}
