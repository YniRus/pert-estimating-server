import { TypedRequestBody, TypedRequestQuery } from '@/definitions/request'

export interface CreateRoomRequest extends TypedRequestBody<{
    pin?: string
}> {}

export interface GetRoomAccessUrlRequest extends TypedRequestQuery<{
    roomId: string
}> {}
