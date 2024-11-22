import { Response } from 'express'
import { Room } from '@/definitions/room'
import { AuthTokenPayload } from '@/definitions/auth'

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export interface TypedResponse<T extends Record<string, any>> extends Response<any, T> {}

export interface AuthResponse extends TypedResponse<AuthMiddlewareLocals> {}

export interface AuthAndDataResponse extends TypedResponse<AuthMiddlewareLocals & DataMiddlewareLocals> {}

export interface DataMiddlewareLocals {
    user: {
        name: string
    }
}

export interface AuthMiddlewareLocals {
    authToken: string
    authTokenPayload: AuthTokenPayload
    room: Room
}
