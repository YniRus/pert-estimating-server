import { TypedRequestBody, TypedRequestQuery } from '@http/definitions/request'

export interface CreateRoomRequest extends TypedRequestBody<{
    pin?: string
}> {}

export interface GetRoomAccessUrlRequest extends TypedRequestQuery<{
    roomId: string
}> {}
