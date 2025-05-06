import { Router } from 'express'
import authRouter from '@http/routes/api/auth'
import roomRouter from '@http/routes/api/room'
import serviceRouter from '@http/routes/api/service'
import assetsRouter from '@http/routes/api/assets'

const router = Router()

router.use(authRouter)
router.use(roomRouter)
router.use(serviceRouter)
router.use(assetsRouter)

export default router
