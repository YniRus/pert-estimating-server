import { Response } from 'express'
import { RoomRaw } from '@/definitions/room'
import { AuthTokenPayload } from '@/definitions/auth'

export interface RoomMiddlewareLocals {
    room: RoomRaw
}

export interface AuthMiddlewareLocals {
    authToken: string
    authTokenPayload: AuthTokenPayload
    room: RoomRaw
}

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export interface TypedResponse<T extends Record<string, any>> extends Response<any, T> {}

export interface RoomResponse extends TypedResponse<RoomMiddlewareLocals> {}
export interface AuthResponse extends TypedResponse<AuthMiddlewareLocals> {}
