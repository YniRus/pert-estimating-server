import { Request } from "express"
import {ParamsDictionary, Query} from "express-serve-static-core"

export interface TypedRequest<B, Q = Query, P = ParamsDictionary> extends Request<P, any, B, Q> {}

export interface TypedRequestBody<T> extends TypedRequest<T> {
    body: T
}

export interface TypedRequestQuery<T extends Query> extends TypedRequest<any, T> {
    query: T
}

export interface TypedRequestParams<T extends ParamsDictionary> extends TypedRequest<any, Query, T> {
    params: T
}