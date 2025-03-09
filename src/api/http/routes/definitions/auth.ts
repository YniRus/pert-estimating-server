import { TypedRequestBody } from '@http/definitions/request'
import { UserRole } from '@/definitions/user'

export interface LoginRequest extends TypedRequestBody<{
    roomId: string
    pin?: string
    role?: UserRole
    name: string
}> {}

export interface LogoutRequest extends TypedRequestBody<null> {}
