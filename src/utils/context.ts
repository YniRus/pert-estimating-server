import { ServiceContext } from '@/definitions/context'
import { BaseResponse } from '@http/definitions/response'
import { Response } from 'express'
import { Socket } from '@ws/definitions/socket-io'

export function getServiceContext<Res extends BaseResponse = BaseResponse>(res: Res): ServiceContext
export function getServiceContext(socket: Socket): ServiceContext
export function getServiceContext(source: Response | Socket): ServiceContext {
    if ('locals' in source) {
        return {
            storage: source.locals.storage,
        }
    } else {
        return {
            storage: source.data.storage,
        }
    }
}
