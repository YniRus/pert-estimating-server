import { UID } from '@/definitions/aliases'
import { Estimates } from '@/definitions/estimates'

export enum UserRole {
    Dev = 'dev',
    QA = 'qa',
}

export interface UserRaw {
    id: UID
    role?: UserRole
    name: string
    estimates: string
}

export interface UserPublic extends Omit<UserRaw, 'estimates'> {}

export interface User extends Omit<UserRaw, 'estimates'> {
    estimates?: Estimates
}
