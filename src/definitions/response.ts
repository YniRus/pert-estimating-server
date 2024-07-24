import {Response} from "express";
import {Room} from "@/definitions/room";
import {UID} from "@/definitions/aliases";

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
    authUserUid: UID
    room: Room
}