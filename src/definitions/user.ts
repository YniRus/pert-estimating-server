import { UID } from '@/definitions/aliases'
import { Estimates } from '@/definitions/estimates'

export enum UserRole {
    Dev = 'dev',
    QA = 'qa',
}

export interface User {
    id: UID
    role?: UserRole
    name: string
    estimates?: Estimates
}
