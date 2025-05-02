import { Response } from 'express'
import { RoomRaw } from '@/definitions/room'
import { AuthTokenPayload } from '@/definitions/auth'
import { AppData } from '@/definitions/app'

export interface AppMiddlewareLocals {
    app: AppData
}

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

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export interface BaseResponse<T = Record<string, any>> extends TypedResponse<T & AppMiddlewareLocals> {}

export interface RoomResponse extends BaseResponse<RoomMiddlewareLocals> {}
export interface AuthResponse extends BaseResponse<AuthMiddlewareLocals> {}
