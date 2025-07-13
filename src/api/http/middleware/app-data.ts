import { NextFunction, Request, Response } from 'express'
import { AppData } from '@/definitions/app'

export default function (req: Request, res: Response, next: NextFunction) {
    const namespace = req.headers['x-app-namespace']
    const subspace = req.headers['x-app-subspace']

    const app: AppData = {
        namespace: typeof namespace === 'string' ? namespace : process.env.APP_NAMESPACE || '_default',
        subspace: typeof subspace === 'string' ? subspace : process.env.APP_SUBSPACE || '_default',
    }

    res.locals = { ...res.locals, app }

    return next()
}
