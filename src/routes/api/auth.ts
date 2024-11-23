import { Router } from 'express'
import { loginHandler, logoutHandler } from '@/controllers/auth'
import authMiddleware from '@/middleware/http/auth'

const authRouter = Router()

authRouter.route('/login')
    .post(loginHandler)

authRouter.route('/logout')
    .post(authMiddleware, logoutHandler)

export default authRouter
