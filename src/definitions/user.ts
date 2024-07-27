import { UID } from '@/definitions/aliases'

export enum UserRole {
    Dev = 'dev',
    QA = 'qa',
}

export interface User {
    uid: UID
    role?: UserRole
    name: string
}
