import { Request } from 'express'
import { CreateRoomRequest } from '@http/routes/definitions/room'
import { getRoomAccessUrl } from '@/utils/room'
import useRoomService from '@/services/room'
import response from '@http/utils/response'
import { AuthResponse, BaseResponse, RoomResponse } from '@http/definitions/response'
import { getServiceContext } from '@/utils/context'

export async function getIsRoomAccessAvailableHandler(req: Request, res: RoomResponse) {
    response(res).success(true)
}

export async function createRoomHandler(req: CreateRoomRequest, res: BaseResponse) {
    const context = getServiceContext(res)

    useRoomService(context).createRoom(req.body.pin, req.body.config)
        .then((room) => response(res).success({ accessUrl: getRoomAccessUrl(room, req.get('origin')) }))
        .catch((error: Error) => response(res).error(500, error.message))
}

export async function getRoomAccessUrlHandler(req: Request, res: AuthResponse) {
    response(res).success({ accessUrl: getRoomAccessUrl(res.locals.room, req.get('origin')) })
}
