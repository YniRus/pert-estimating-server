import { Router } from 'express'
import { createRoomHandler } from '@/controllers/room'

const roomRouter = Router()

roomRouter.route('/room')
    .post(createRoomHandler)

export default roomRouter
