import { Router } from 'express'
import authMiddleware from '@http/middleware/auth'
import { pingHandler } from '@http/controllers/service'

const roomRouter = Router()

roomRouter.route('/ping')
    .post(authMiddleware, pingHandler)

export default roomRouter
