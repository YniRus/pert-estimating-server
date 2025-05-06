import { Request } from 'express'
import { AuthResponse } from '@http/definitions/response'
import { existsSync } from 'fs'
import path from 'path'

export async function getLogoHandler(req: Request, res: AuthResponse) {
    const namespace = res.locals.app.namespace

    const logoFile = ['svg', 'png']
        .map((ext) => ({
            ext,
            path: path.resolve(`assets/${namespace}/logo.${ext}`),
        }))
        .find((file) => existsSync(file.path))

    if (logoFile) {
        return res.sendFile(logoFile.path)
    }

    return res.sendStatus(404)
}
