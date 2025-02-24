import { Router } from 'express'
import authMiddleware from '@/middleware/http/auth'
import { pingHandler } from '@/controllers/service'

const roomRouter = Router()

roomRouter.route('/ping')
    .post(authMiddleware, pingHandler)

export default roomRouter
