import { Router } from 'express'
import { createRoomHandler, getRoomAccessUrlHandler } from '@http/controllers/room'
import authMiddleware from '@http/middleware/auth'

const roomRouter = Router()

roomRouter.route('/room')
    .post(createRoomHandler)

roomRouter.route('/room-access-url')
    .get(authMiddleware, getRoomAccessUrlHandler)

export default roomRouter
