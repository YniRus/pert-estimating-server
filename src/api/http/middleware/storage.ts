import { NextFunction, Request, Response } from 'express'
import baseStorage, { prefixStorage } from '@/lib/storage'

export default function (req: Request, res: Response, next: NextFunction) {
    const {
        namespace = process.env.APP_NAMESPACE || '_default',
        subspace = process.env.APP_SUBSPACE || '_default',
    } = res.locals.app

    let storage = baseStorage

    if (namespace) storage = prefixStorage(storage, namespace)
    if (subspace) storage = prefixStorage(storage, subspace)

    res.locals = { ...res.locals, storage }

    return next()
}
