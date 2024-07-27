import { Router } from 'express'
import { loginHandler } from '@/controllers/auth'

const authRouter = Router()

authRouter.route('/login')
    .post(loginHandler)

export default authRouter
