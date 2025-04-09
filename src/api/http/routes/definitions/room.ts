import { TypedRequestBody } from '@http/definitions/request'

export interface CreateRoomRequest extends TypedRequestBody<{
    pin?: string
}> {}
