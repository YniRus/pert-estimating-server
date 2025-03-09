import { Response } from 'express'
import { error as errorResponse } from '@/utils/response'

export default (res: Response) => ({
    success(data: unknown) {
        return res.status(200).json(data)
    },

    error(error: Error, code = 500) {
        return res.status(code).json(errorResponse(error))
    },
})
