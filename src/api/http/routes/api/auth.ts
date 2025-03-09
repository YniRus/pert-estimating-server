import { Router } from 'express'
import { authHandler, loginHandler, logoutHandler } from '@http/controllers/auth'
import authMiddleware from '@http/middleware/auth'

const authRouter = Router()

authRouter.route('/login')
    .post(loginHandler)

authRouter.route('/auth')
    .get(authMiddleware, authHandler)

authRouter.route('/logout')
    .post(authMiddleware, logoutHandler)

export default authRouter
