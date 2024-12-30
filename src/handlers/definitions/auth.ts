import { UID } from '@/definitions/aliases'
import { User } from '@/definitions/user'

export interface AuthWSResponse {
    roomId: UID
    user: User
}
