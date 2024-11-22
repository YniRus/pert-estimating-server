import { UID } from '@/definitions/aliases'

export interface AuthTokenPayload {
    user: UID
    room: UID
    pin?: string
}
