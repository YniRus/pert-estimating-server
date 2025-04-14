import { CorsOptions } from 'cors'

export function getCorsOptions(): CorsOptions {
    const originPattern = process.env.CORS_ORIGIN_PATTERN || 'http://localhost'

    return {
        origin: new RegExp(originPattern, 'i'),
        credentials: true,
    }
}
