import { Router } from 'express'
import authRouter from '@/routes/api/auth'
import roomRouter from '@/routes/api/room'

const router = Router()

router.use(authRouter)
router.use(roomRouter)

export default router
