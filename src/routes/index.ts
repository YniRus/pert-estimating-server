import { Router } from 'express'
import authRouter from '@/routes/api/auth'
import roomRouter from '@/routes/api/room'
import serviceRouter from '@/routes/api/service'

const router = Router()

router.use(authRouter)
router.use(roomRouter)
router.use(serviceRouter)

export default router
