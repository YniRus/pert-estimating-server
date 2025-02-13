import { UID } from '@/definitions/aliases'

export interface AuthTokenPayload {
    user: UID
    estimates: UID
    room: UID
    pin?: string
}
