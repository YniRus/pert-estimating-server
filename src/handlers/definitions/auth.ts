import { UID } from '@/definitions/aliases'
import { User } from '@/definitions/user'

export interface MyAuthWSResponse {
    roomId: UID
    user: User
}
