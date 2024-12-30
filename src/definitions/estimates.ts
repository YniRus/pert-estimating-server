import { UID } from '@/definitions/aliases'

export interface Estimates {
    room: UID
    user: UID
    estimate: {
        min?: number
        probable?: number
        max?: number
    }
    visible: boolean
}
