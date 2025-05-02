import { NextFunction, Request, Response } from 'express'
import { AppData } from '@/definitions/app'

export default function (req: Request, res: Response, next: NextFunction) {
    const namespace = req.headers['x-app-namespace']
    const subspace = req.headers['x-app-subspace']

    const app: AppData = {
        namespace: typeof namespace === 'string' ? namespace : undefined,
        subspace: typeof subspace === 'string' ? subspace : undefined,
    }

    console.log('Request from: ', app)

    res.locals = { ...res.locals, app }

    return next()
}
