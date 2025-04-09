import { Router } from 'express'
import {
    createRoomHandler,
    getIsRoomAccessAvailableHandler,
    getRoomAccessUrlHandler,
} from '@http/controllers/room'
import authMiddleware from '@http/middleware/auth'
import roomMiddleware from '@http/middleware/room'

const roomRouter = Router()

roomRouter.route('/room')
    .post(createRoomHandler)

roomRouter.route('/is-room-access-available')
    .get(roomMiddleware, getIsRoomAccessAvailableHandler)

roomRouter.route('/room-access-url')
    .get(authMiddleware, getRoomAccessUrlHandler)

export default roomRouter
