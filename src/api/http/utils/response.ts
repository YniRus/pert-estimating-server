import { Response } from 'express'
import { STATUS_CODES } from 'node:http'

export default (res: Response) => ({
    success(data: unknown) {
        return res.status(200).json(data)
    },

    error(code = 500, message?: string) {
        res.statusMessage = message ?? STATUS_CODES[code] ?? 'Unknown Error'
        return res.sendStatus(code)
    },
})
