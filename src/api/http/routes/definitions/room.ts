import { TypedRequestBody } from '@http/definitions/request'
import { RoomConfig } from '@/definitions/room'

export interface CreateRoomRequest extends TypedRequestBody<{
    pin?: string
    config?: RoomConfig
}> {}
