import { Router } from 'express'
import { getLogoHandler } from '@http/controllers/assets'

const roomRouter = Router()

roomRouter.route('/assets/logo')
    .get(getLogoHandler)

export default roomRouter
