import { Request, Response } from 'express'
import { CreateRoomRequest } from '@http/routes/definitions/room'
import { getRoomAccessUrl } from '@/utils/room'
import { createRoom } from '@/services/room'
import response from '@http/utils/response'
import { AuthResponse, RoomResponse } from '@http/definitions/response'

export async function getIsRoomAccessAvailableHandler(req: Request, res: RoomResponse) {
    response(res).success(true)
}

export async function createRoomHandler(req: CreateRoomRequest, res: Response) {
    createRoom(req.body.pin, req.body.config)
        .then((room) => response(res).success({ accessUrl: getRoomAccessUrl(room) }))
        .catch((error: Error) => response(res).error(500, error.message))
}

export async function getRoomAccessUrlHandler(req: Request, res: AuthResponse) {
    response(res).success({ accessUrl: getRoomAccessUrl(res.locals.room) })
}
