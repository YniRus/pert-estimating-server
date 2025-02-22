import { Router } from 'express'
import { createRoomHandler, getRoomAccessUrlHandler } from '@/controllers/room'
import authMiddleware from '@/middleware/http/auth'

const roomRouter = Router()

roomRouter.route('/room')
    .post(createRoomHandler)

roomRouter.route('/room-access-url')
    .get(authMiddleware, getRoomAccessUrlHandler)

export default roomRouter
