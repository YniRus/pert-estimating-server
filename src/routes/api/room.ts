import { Router } from 'express'
import { createRoomHandler, getRoomHandler } from '@/controllers/room'
import authMiddleware from '@/middleware/http/auth'

const roomRouter = Router()

roomRouter.route('/room/:roomId')
    .get(authMiddleware, getRoomHandler)

roomRouter.route('/room')
    .post(createRoomHandler)

export default roomRouter
