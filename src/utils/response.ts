import { STATUS_CODES } from 'node:http'

export class RequestError extends Error {
    response: Required<ErrorResponse>

    constructor(code = 500, message?: string) {
        super(message ?? STATUS_CODES[code])
        this.name = this.constructor.name
        this.response = error(this, code)
    }

    get data() {
        return this.response.error
    }
}

export interface ErrorResponse {
    error: {
        message: string
        type: string
        code?: number
    }
}

export function error(error: Error, code?: number): ErrorResponse {
    return {
        error: {
            message: error.message,
            type: error.name,
            ...(typeof code === 'number' && { code }),
        },
    }
}
