import { Request } from "express"
import { Query } from "express-serve-static-core"

export interface TypedRequestBody<T> extends Request {
    body: T
}

export interface TypedRequestQuery<T extends Query> extends Request {
    query: T
}

export interface TypedRequest<Q extends Query, B> extends Request {
    query: Q
    body: B
}