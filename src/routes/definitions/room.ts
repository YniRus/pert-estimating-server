import {TypedRequestBody, TypedRequestParams} from "@/definitions/request";

export interface CreateRoomRequest extends TypedRequestBody<{
    pin?: string
}> {}

export interface GetRoomRequest extends TypedRequestParams<{
    roomId: string
}> {}