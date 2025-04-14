import { Timestamp, UID } from '@/definitions/aliases'
import { User } from '@/definitions/user'
import { EstimateVariant } from '@/definitions/estimates'

export interface RoomRaw {
    id: UID
    pin?: string
    users: UID[]
    createdAt: Timestamp
    estimatesVisible?: boolean
    config?: RoomConfig
}

export interface RoomConfig {
    estimateVariants?: EstimateVariant[]
}

export interface RoomPublic extends Omit<RoomRaw, 'pin' | 'createdAt'> {}

export interface Room extends Omit<RoomPublic, 'users'> {
    users: User[]
}

export interface RoomWithoutConfig extends Omit<Room, 'config'> {}
