import { Router } from 'express'
import { authHandler, loginHandler, logoutHandler } from '@/controllers/auth'
import authMiddleware from '@/middleware/http/auth'

const authRouter = Router()

authRouter.route('/login')
    .post(loginHandler)

authRouter.route('/auth')
    .get(authMiddleware, authHandler)

authRouter.route('/logout')
    .post(authMiddleware, logoutHandler)

export default authRouter
