import { Response } from 'express'
import { error, RequestError } from '@/utils/response'

export default (res: Response) => ({
    success(data: unknown) {
        return res.status(200).json(data)
    },

    error(code = 500, message?: string) {
        return res.status(code).send(error(new RequestError(code, message)))
    },
})
